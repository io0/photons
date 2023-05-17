# -----------------------------------------------------------------------------
# Copyright (c) 2009-2016 Nicolas P. Rougier. All rights reserved.
# Distributed under the (new) BSD License.
# -----------------------------------------------------------------------------
import numpy as np
from glumpy import app, glm
from glumpy.graphics.text import FontManager
from glumpy.transforms import Position, Trackball, Viewport
from glumpy.graphics.collections import GlyphCollection
from glumpy.graphics.collections import PathCollection
from glumpy.graphics.collections import SegmentCollection
from scapy.all import *


app.use('glfw')
window = app.Window(width=1000, height=800, color=(0, 0, 0, 1))


def reset():
    transform.theta = 0
    transform.phi = 0
    transform.zoom = 16.5


def generate_exponential():
    mean_time = 2  # mean time in seconds
    samples = np.random.exponential(scale=mean_time, size=1000)

    # Create a linear space of bins
    num_bins = 64
    bin_edges = np.linspace(0, 10, num_bins + 1)

    # Count the number of samples in each bin
    hist, _ = np.histogram(samples, bins=bin_edges)
    return hist/100


def bytes_to_int(data_bytes):
    data = []
    for i in range(0, len(data_bytes), 4):
        data.append(struct.unpack('i', data_bytes[i:i + 4])[0]/100)
    return data


def get_data():
    packet = sniff(iface="Ethernet 3", count=1)[0]
    data = packet[Raw].load
    arr = np.array(bytes_to_int(data))
    return arr


transform = Trackball(Position())
viewport = Viewport()
paths = PathCollection(mode="agg++", transform=transform, viewport=viewport)


n_samples = 64
t = 0
ydata = np.zeros(n_samples)
zdata = np.zeros(n_samples)
xdata = np.linspace(-0.8, 0.8, n_samples)

all_paths = []


@window.event
def on_draw(dt):
    global t, paths
    window.clear()
    # ydata = generate_exponential()
    ydata = get_data()
    path = np.array([xdata, ydata, zdata]).T
    if (t > 40):
        all_paths.pop(0)
    all_paths.append(path)
    t += 1
    paths = PathCollection(
        mode="agg+", transform=transform, viewport=viewport, color='local')
    for idx, p in enumerate(all_paths[::-1]):
        # the most recent is first
        age = (1 - idx/len(all_paths))**3
        paths.append(p, color=(age/2, age, 1, age))
    # paths["color"] = 1, 0, 1, 1
    window.attach(paths["transform"])
    window.attach(paths["viewport"])
    paths.draw()


paths["color"] = 0, 0, 1, 1
window.attach(paths["transform"])
window.attach(paths["viewport"])
reset()
app.run()
