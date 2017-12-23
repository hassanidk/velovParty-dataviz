import json
import requests
from datetime import datetime
import os
from apscheduler.schedulers.blocking import BlockingScheduler




uri = "https://data.rennesmetropole.fr/api/records/1.0/search/?rows=100&dataset=etat-des-stations-le-velo-star-en-temps-reel&facet=nom&facet=etat&facet=nombreemplacementsactuels&facet=nombreemplacementsdisponibles&facet=nombrevelosdisponibles"
sub_data = {}


def createFile():
	print("CREATE FILE")
	print(datetime.now())
	
	req = requests.get(uri, headers={'content-type': 'application/json'})
	data = req.json()
	records = data['records']

	sub_data['nbJours'] = 7
	sub_data['nbPasHeures']  = 1
	sub_data['records'] = []
	for i in range (0, len(records)):
		fields = records[i]['fields']
		id_station = fields['idstation']
		date_time = fields['lastupdate']
		nom = fields['nom']
		etat = fields['etat']
		taux_remplissage = 0.0
		if etat == "En fonctionnement":
			taux_remplissage = round(fields['nombrevelosdisponibles'] / fields['nombreemplacementsactuels'] * 100, 0)
		sub_data['records'].append({'station_id' : id_station, 'nom' : nom, 'etat': [{date_time : taux_remplissage}]})
		with open("historic.json", "w") as outfile:
				json.dump(sub_data, outfile)
	

def majFile():	
	print("MAJ FILE")
	print(datetime.now())

	req = requests.get(uri, headers={'content-type': 'application/json'})
	data = req.json()
	records = data['records']

	with open("historic.json", "r") as infile:
		dataInfile = json.load(infile)
		recordsInfile = dataInfile['records']

	for i in range (0, len(records)):
		fields = records[i]['fields']
		id_station = fields['idstation']
		date_time = fields['lastupdate']
		nom = fields['nom']
		etat = fields['etat']
		taux_remplissage = 0
		if etat == "En fonctionnement":
			taux_remplissage = round(fields['nombrevelosdisponibles'] / fields['nombreemplacementsactuels'] * 100, 0)
		sub_data['records'][i]['etat'].append({date_time: taux_remplissage})
		
		with open("historic.json", "w") as outfile:
				json.dump(sub_data, outfile)

	

if __name__ == "__main__":
	sched = BlockingScheduler()	
	sched.add_job(createFile,trigger='cron',  day=23, month=12, hour=23, minute=0, second=0)
	sched.add_job(majFile, trigger='interval', hours=1, start_date="2017-12-23 23:00:00", end_date="2017-12-24 23:00:00")
	print("DEBUT JOB")
	sched.start()


