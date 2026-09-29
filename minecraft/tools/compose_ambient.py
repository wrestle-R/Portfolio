"""Compose an original, seamless 96-second ambient piano loop. No sampled music.
Requires numpy and ffmpeg. Output is a small stereo MP3 with slow attack/release.
"""
from pathlib import Path
import subprocess
import wave
import numpy as np

RATE = 32000
DURATION = 96
N = RATE * DURATION
mix = np.zeros((N, 2), dtype=np.float64)

def note(midi, start, length, velocity, pan=0, pad=False):
    t = np.arange(int(length*RATE))/RATE
    f = 440 * 2**((midi-69)/12)
    if pad:
        signal = (np.sin(2*np.pi*f*t)+.24*np.sin(2*np.pi*f*1.0017*t)+.08*np.sin(2*np.pi*f*2*t))
        env = np.sin(np.pi*t/length)**2
    else:
        # Soft hammer attack, detuned strings and faster-decaying upper partials.
        signal = np.zeros(len(t))
        for partial, amp, decay in ((1,1,2.4),(2,.25,1.65),(3,.08,.85),(4,.025,.5)):
            signal += amp*np.sin(2*np.pi*f*partial*t+.002*partial*t*t)*np.exp(-t/decay)
        signal += .14*np.sin(2*np.pi*f*1.0009*t)*np.exp(-t/2.2)
        env = (1-np.exp(-t/0.028)) * np.minimum(1, (length-t)/.8)
    signal *= env*velocity
    # Circular accumulation lets reverb tails cross the loop boundary naturally.
    idx=(int(start*RATE)+np.arange(len(t)))%N
    mix[idx,0] += signal*np.sqrt((1-pan)/2)
    mix[idx,1] += signal*np.sqrt((1+pan)/2)

# Eight slow, open voicings in D major / B minor, with a separately authored melody.
chords=[(38,57,61,66),(35,54,59,62),(43,54,57,62),(45,57,61,64),
        (38,54,61,64),(35,57,62,66),(43,55,59,62),(45,52,57,61)]
melodies=[(78,73,76),(74,71,69),(71,74,78),(76,73,69),
          (73,76,78),(78,74,71),(74,71,69),(73,69,66)]
for bar, chord in enumerate(chords):
    at=bar*12
    note(chord[0],at,10,.10,-.12)
    for j,pitch in enumerate(chord[1:]):
        note(pitch,at+j*.16,11,.026,(-.35+j*.35),True)
    for j in range(5):
        pitch=chord[1+j%3]+(12 if j==4 else 0)
        note(pitch,at+.6+j*1.85,6,.105 if j%2 else .13,(-.25 if j%2 else .25))
    for j,pitch in enumerate(melodies[bar]):
        note(pitch,at+2+j*3.3,6,.075,(-.1+j*.1))

# Sparse stereo room reflections with a smooth, circular reverb tail.
dry=mix.copy()
for delay,gain in ((.11,.11),(.23,.09),(.41,.075),(.67,.055),(1.03,.045),(1.59,.032),(2.17,.022),(3.13,.014)):
    mix += np.roll(dry[:,::-1],int(RATE*delay),axis=0)*gain
mix *= .65/max(1e-6,np.abs(mix).max())
root=Path(__file__).resolve().parents[1]
wav=Path('/tmp/portfolio-snowfall.wav')
with wave.open(str(wav),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(RATE)
    f.writeframes((mix*32767).astype('<i2').tobytes())
out=root/'assets/audio/snowfall.mp3'
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(wav),'-codec:a','libmp3lame','-b:a','112k','-metadata','title=Snowfall — original portfolio ambient','-metadata','comment=Procedurally composed original instrumental; no third-party samples',str(out)],check=True)
print(f'{out}: {out.stat().st_size} bytes, {DURATION}s')
