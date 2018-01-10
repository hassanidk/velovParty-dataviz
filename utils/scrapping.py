import json
import requests
from datetime import datetime
import os
#from apscheduler.schedulers.blocking import BlockingScheduler


#uri = "https://data.rennesmetropole.fr/api/records/1.0/search/?rows=100&dataset=etat-des-stations-le-velo-star-en-temps-reel&facet=nom&facet=etat&facet=nombreemplacementsactuels&facet=nombreemplacementsdisponibles&facet=nombrevelosdisponibles"
#uriPark = "https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=export-api-parking-citedia"
sub_data = {}

all_historic_json=open('C:/Users/tangu/Documents/GitHub/velovParty-dataviz/data/allHistoric.json')
all_historic = json.load(all_historic_json)

recup_parking_json=open('C:/Users/tangu/Documents/GitHub/velovParty-dataviz/data/historic.json')
recup_parking=json.load(recup_parking_json)

#all_historic
#for i in range(83,93):
#    records = recup_parking['records'][i]
#    all_historic['records'].append(records)
    
date=all_historic['records'][0]['etat']
for i in range(83,93):
    all_historic['records'].append(date)
    
#print("CREATE FILE")
#print(datetime.now())
#sub_data['nbJours'] = 7
#sub_data['nbPasHeures']  = 1
#sub_data['records'] = []
#for i in range (len(records), len(records)+10):
#	fields = records[i]['fields']
#	id_station = fields['idstation']
#	date_time = fields['lastupdate']
#	nom = fields['nom']
#	etat = fields['etat']
#	taux_remplissage = 0.0
#	if etat == "En fonctionnement":
#		taux_remplissage = round(fields['nombrevelosdisponibles'] / fields['nombreemplacementsactuels'] * 100, 0)
#	sub_data['records'].append({'station_id' : id_station, 'nom' : nom, 'etat': [{date_time : taux_remplissage}]})
#	with open("historic.json", "w") as outfile:
#			json.dump(sub_data, outfile)
#for i in range (0, len(parks)):
#	ide = 100 + i
#	fields = parks[i]['fields']
#	status = fields['status']
#	name=fields['key']
#	max_park = fields['max']
#	free=fields['free']
#	taux_remplissage = 0.0
#	if status == "OUVERT":
#		taux_remplissage = round(free / max_park * 100, 0)
#	sub_data['records'].append({'station_id' : ide, 'nom' : name, 'etat': [{date_time : taux_remplissage}]})
#	with open("historic.json", "w") as outfile:
#		json.dump(sub_data, outfile)
#
#req = requests.get(uri, headers={'content-type': 'application/json'})
#data = req.json()
#records = data['records']
#reqPark = requests.get(uriPark, headers={'content-type': 'application/json'})
#dataPark = reqPark.json()
#parks = dataPark['records']
#print("MAJ FILE")
#print(datetime.now())
#with open("historic.json", "r") as infile:
#	dataInfile = json.load(infile)
#	recordsInfile = dataInfile['records']
#for i in range (0, len(records)):
#	fields = records[i]['fields']
#	id_station = fields['idstation']
#	date_time = fields['lastupdate']
#	nom = fields['nom']
#	etat = fields['etat']
#	taux_remplissage = 0.0
#	if etat == "En fonctionnement":	
#		taux_remplissage = round(fields['nombrevelosdisponibles'] / fields['nombreemplacementsactuels'] * 100, 0)
#	sub_data['records'][i]['etat'].append({date_time: taux_remplissage})
#	with open("historic.json", "w") as outfile:
#			json.dump(sub_data, outfile)
#j = 0
#for i in range (len(records) , 	len(sub_data['records'])):	
#	ide = 100 + i
#	fields = parks[j]['fields']
#	status = fields['status']
#	name=fields['key']
#	max_park = fields['max']
#	free=fields['free']
#	taux_remplissage = 0.0
#	if status == "OUVERT":
#		taux_remplissage = round(free / max_park * 100, 0)
#	
#	sub_data['records'][i]['etat'].append({date_time : taux_remplissage})
#	with open("historic.json", "w") as outfile:
#		json.dump(sub_data, outfile)	
#	j= j+1

