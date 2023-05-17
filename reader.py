from scapy.all import *
import matplotlib.pyplot as plt

# Open the file for reading using the PcapReader class
pcap_reader = PcapReader("packets.pcap")


def bytes_to_doubles(data_bytes):
    data = []
    for i in range(0, len(data_bytes), 8):
        data.append(struct.unpack('d', data_bytes[i:i + 8])[0])

    return data


def read_payload(packet):
    try:
        payload = packet.load
        arr = bytes_to_doubles(payload)
        plt.plot(arr)
    except:
        print("error!")


# Read each packet in the file
for packet in pcap_reader:
    # Process the packet as needed
    # print(packet.show())
    read_payload(packet)
plt.show()
# Close the file
pcap_reader.close()
