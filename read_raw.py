import struct
import matplotlib.pyplot as plt

filename = 'packets.pcap'
with open(filename, 'rb') as f:
    data_bytes = f.read()
    print(len(data_bytes))
    # Convert bytes to list of doubles
    data = []
    while len(data_bytes) >= 8:
        d = struct.unpack('d', data_bytes[:8])[0]
        data.append(d)
        data_bytes = data_bytes[8:]
    plt.plot(data)
    plt.show()
    # print(data)
