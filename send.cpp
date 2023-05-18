#include <iostream>
#include <fstream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

#define BUFFER_SIZE 1024

int main()
{
  int sockfd;
  struct sockaddr_in serverAddr;

  // Create socket
  if ((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) == -1)
  {
    perror("socket");
    return 1;
  }

  serverAddr.sin_family = AF_INET;
  serverAddr.sin_port = htons(1234);                   // Set the target port number
  serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1"); // Set the target IP address

  // Prepare the data to be sent (1 MB of random data)
  std::ofstream outfile("data.bin", std::ios::binary | std::ios::out);
  std::srand(std::time(nullptr));
  for (int i = 0; i < 1024 * 1024; ++i)
  {
    char randomByte = static_cast<char>(std::rand() % 256);
    outfile.write(&randomByte, sizeof(randomByte));
  }
  outfile.close();

  // Open the data file for reading
  std::ifstream infile("data.bin", std::ios::binary | std::ios::in);

  // Send the data in chunks
  char buffer[BUFFER_SIZE];
  while (!infile.eof())
  {
    infile.read(buffer, BUFFER_SIZE);
    ssize_t bytesSent = sendto(sockfd, buffer, infile.gcount(), 0, (struct sockaddr *)&serverAddr, sizeof(serverAddr));
    if (bytesSent == -1)
    {
      perror("sendto");
      return 1;
    }
  }

  // Close the file and socket
  infile.close();
  close(sockfd);

  std::cout << "Data sent successfully.\n";
  return 0;
}
