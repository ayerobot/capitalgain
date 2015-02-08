#!usr/bin/env python
import numpy as np
from scipy.stats import norm
import requests
from random import randint
from utils import get_data

all_chords = ['664', '66', '6', '264', '26', '2', '364', '36', '3', '27', '37', '67', 'b7', '47', '57', '17', '5/5', '464', '46', '4', '564', '56', '5', '164', '16', '1']

"""Returns dict"""
def get_chord_probs(previous_chords):
	print "prev_chords = ", previous_chords
	payload = {'cp':','.join(previous_chords)}
	chords = requests.get('http://www.hooktheory.com/api/trends/stats', params=payload).json()
	probs = {chord['chord_ID'] : chord['probability'] for chord in chords}
	return probs

"""Data must be normal array not numpy array, returns two normal arrays"""
def get_duration(data):
	i = 1
	count = [1]
	while i < len(data):
		if data[i] == data[i-1]:
			count[-1] += 1
			data.pop(i)
		else:
			i += 1
			count.append(1)
	return data, count


"""index = index of all_chords"""
def get_best_chord(index, previous_chords):
	chord_probs = get_chord_probs(previous_chords)
	probs = norm.pdf(np.arange(len(all_chords)), index)
	all_chord_dict = {chord : p for chord, p in zip(all_chords, probs)}
	max_prob = float('-inf')
	best_chord = None
	for chord in chord_probs:
		if chord in all_chord_dict:
			prob = chord_probs[chord] * all_chord_dict[chord]
			if prob > max_prob:
				max_prob = prob
				best_chord = chord
	if not best_chord: # suuuuper hacky
		best_chord = get_best_chord(index, previous_chords[-len(previous_chords) + 1:])
	return best_chord

def generate_song(filename):
	delta = get_data(filename)
	delta, count = get_duration(delta)
	# Obtain first chord
	song = [requests.get('http://www.hooktheory.com/api/trends/stats').json()[randint(0, 10)]['chord_ID']]

	# Generate rest of song
	for datapoint in delta:
		song.append(get_best_chord(datapoint, song[-randint(1, 4):]))
		#if len(song) % 8 == 0:
		#	song[-1] = song[-1][0]
		print song[-1]

	return song, count









