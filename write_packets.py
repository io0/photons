from scapy.all import conf, sniff, wrpcap, PcapWriter, Raw
import sys
import matplotlib.pyplot as plt
import struct
import pyshark

# Set npcap as the capture interface
conf.use_pcap = True
conf.pcap_filter = ""
# Set the snaplen value to capture larger packets (e.g., 65535 bytes)
conf.sniff_promisc = True
conf.sniff_timeout = 10  # Sniffing timeout (in seconds)
conf.sniff_promiscuous = 1  # Enable promiscuous mode
# conf.sniff_l2socket = L2Socket(iface="Ethernet 3")
conf.snaplen = 65535

# Callback function to process captured packets

interface = "Ethernet 3"


def bytes_to_doubles(data_bytes):
    data = []
    for i in range(0, len(data_bytes), 8):
        data.append(struct.unpack('d', data_bytes[i:i + 8])[0])
    return data


def bytes_to_int(data_bytes):
    data = []
    for i in range(0, len(data_bytes), 4):
        data.append(struct.unpack('i', data_bytes[i:i + 4])[0])
    return data


def plot_packet(packet):
    payload = packet.load
    print(type(payload))
    print(packet.summary())
    # arr = bytes_to_doubles(payload)
    arr = bytes_to_int(payload)
    plt.plot(arr)
    plt.show()


filename = 'packets.pcap'


def write_packet_payload(packet):
    wrpcap(filename, packet.getlayer(Raw).load, append=True)


# Create a PcapWriter object to write packets to disk without the PCAP header
pcap_writer = PcapWriter(filename, append=True, sync=True, nano=False)


def write_packet(packet):
    # plot_packet(packet)
    # pcap_writer.write(packet)
    print(packet.summary())


# Start capturing packets
try:
    # sniff(iface=interface, prn=process_packet, count=0)
    sniff(iface=interface, filter="ether proto 0x1234", prn=write_packet)
except KeyboardInterrupt:
    sys.exit()

# Set the desired snaplen value (maximum capture size)

# # Set the capture size
# capture_size = 65535  # Set the desired capture size in bytes

# # Create a capture object
# # Set the TShark command with capture size option
# tshark_command = ['tshark', '-i', interface, '-s', str(capture_size)]

# # Execute the TShark command
# process = subprocess.Popen(tshark_command, stdout=subprocess.PIPE)

# # Read the captured packets
# for line in process.stdout:
#     packet = line.decode().strip()
#     # Process the captured packet
#     print(packet)
# Close the file
pcap_writer.close()
