# -*- coding: utf-8 -*-
"""
Éditeur de Spyder

Ceci est un script temporaire.
""" 

import json
import requests
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler


uri2 = "http://data.citedia.com/r1/parks/"
sub_data = {}


req = requests.get(uri2, headers={'content-type': 'application/json'})
data = req.json()
#print(data)
parks = data['parks']
print("CREATE FILE")
print(datetime.now())
sub_data['nbJours'] = 7
sub_data['nbPasHeures']  = 1
sub_data['parks'] = []
for i in range (0, len(parks)):
    ide=100+i
    name = parks[i]['parkInformation']['name']
    status = parks[i]['parkInformation']['status']
    max_park = parks[i]['parkInformation']['max']
    free=parks[i]['parkInformation']['free']
    taux_remplissage = 0.0
    if status == "AVAILABLE":
        taux_remplissage = round(free / max_park * 100, 0)
    sub_data['parks'].append({'ide' : ide, 'name' : name, 'status' : status,'max' : max_park,'free' : free})

    
#	sub_data['records'].append({'station_id' : id_station, 'nom' : nom, 'etat': [{date_time : taux_remplissage}]})
#	with open("historic.json", "w") as outfile:
#			json.dump(sub_data, outfile)
	

#def majFile():	
#	req = requests.get(uri, headers={'content-type': 'application/json'})
#	data = req.json()
#	records = data['records']
#	print("MAJ FILE")
#	print(datetime.now())
#	with open("historic.json", "r") as infile:
#		dataInfile = json.load(infile)
#		recordsInfile = dataInfile['records']
#
#	for i in range (0, len(records)):
#		fields = records[i]['fields']
#		id_station = fields['idstation']
#		date_time = fields['lastupdate']
#		nom = fields['nom']
#		etat = fields['etat']
#		taux_remplissage = 0.0
#		if etat == "En fonctionnement":
#			taux_remplissage = round(fields['nombrevelosdisponibles'] / fields['nombreemplacementsactuels'] * 100, 0)
#		sub_data['records'][i]['etat'].append({date_time: taux_remplissage})
#		
#		with open("historic.json", "w") as outfile:
#				json.dump(sub_data, outfile)
#
#	
#
#if __name__ == "__main__":
#	sched = BlockingScheduler()
#	createFile()	
#	sched.add_job(createFile, 'cron', month=12, day=26, hour=0, minute=0, second=0)
#	sched.add_job(majFile, 'interval', hours=1, start_date="2017-12-26 00:00:00", end_date="2017-12-26 00:00:00")
#	print("DEBUT JOB")
#	print(datetime.now())
#	sched.start()