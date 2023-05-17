from scapy.all import Ether, Raw, sendp
import numpy as np
import matplotlib.pyplot as plt
import struct
import time


def generate_exponential():
    mean_time = 2  # mean time in seconds
    samples = np.random.exponential(scale=mean_time, size=1000)

    # Create a linear space of bins
    num_bins = 64
    bin_edges = np.linspace(0, 10, num_bins + 1)

    # Count the number of samples in each bin
    hist, _ = np.histogram(samples, bins=bin_edges)
    return hist


def generate_exponentials_bytes(n):
    big_arr = bytearray()
    for _ in range(n):
        y = generate_exponential()
        for d in y:
            big_arr += struct.pack('i', d)
    return big_arr


while True:
    packets = []
    for _ in range(1):
        big_arr = generate_exponentials_bytes(1)
        packet = Ether(type=0x1234) / Raw(big_arr)
        packets.append(packet)
    sendp(packets, iface='Ethernet 3', verbose=False)
    time.sleep(0.02)

# record the time
start = time.time()

sendp(packets, iface='Ethernet 3', verbose=False)
end = time.time()
print(end - start)
