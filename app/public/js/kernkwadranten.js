var kernkwadranten = {
	1: {
		kwaliteit: { naam: 'accuratesse', omschrijving: 'nauwgezetheid, nauwkeurigheid, precisie, stiptheid, zorgvuldigheid' },
		valkuil: { naam: 'pietluttigheid', omschrijving: 'benepen, keutelachtig, kleinzielig, pietepeuterig' },
		allergie: { naam: 'warrigheid', omschrijving: 'chaotisch, ingewikkeld, onduidelijk' },
		uitdaging: { naam: 'creativiteit', omschrijving: 'artistiek, fantasierijk, inventief, origineel, vindingrijk' }
	},
	2: {
		kwaliteit: { naam: 'autonoom', omschrijving: '' },
		valkuil: { naam: 'dwars', omschrijving: '' },
		allergie: { naam: 'onderdanig', omschrijving: '' },
		uitdaging: { naam: 'meegaand', omschrijving: '' }
	},
	3: {
		kwaliteit: { naam: 'bedachtzaam', omschrijving: '' },
		valkuil: { naam: 'beducht', omschrijving: '' },
		allergie: { naam: 'roekeloos', omschrijving: '' },
		uitdaging: { naam: 'moedig', omschrijving: '' }
	},
	4: {
		kwaliteit: { naam: 'beheerst', omschrijving: '' },
		valkuil: { naam: 'onpersoonlijk', omschrijving: '' },
		allergie: { naam: 'onbereikbaar', omschrijving: '' },
		uitdaging: { naam: 'empathisch', omschrijving: '' }
	},
	5: {
		kwaliteit: { naam: 'behulpzaam', omschrijving: '' },
		valkuil: { naam: 'bemoeizuchtig', omschrijving: '' },
		allergie: { naam: 'onverschillig', omschrijving: '' },
		uitdaging: { naam: 'los laten', omschrijving: '' }
	},
	6: {
		kwaliteit: { naam: 'bescheiden', omschrijving: '' },
		valkuil: { naam: 'onzichtbaar', omschrijving: '' },
		allergie: { naam: 'arrogant', omschrijving: '' },
		uitdaging: { naam: 'profileren', omschrijving: '' }
	},
	7: {
		kwaliteit: { naam: 'beschouwend', omschrijving: '' },
		valkuil: { naam: 'afstandelijk', omschrijving: '' },
		allergie: { naam: 'sentimenteel', omschrijving: '' },
		uitdaging: { naam: 'empathisch', omschrijving: '' }
	},
	8: {
		kwaliteit: { naam: 'besluitvaardig', omschrijving: '' },
		valkuil: { naam: 'forceren', omschrijving: '' },
		allergie: { naam: 'besluiteloos', omschrijving: '' },
		uitdaging: { naam: 'ontvankelijk', omschrijving: '' }
	},
	9: {
		kwaliteit: { naam: 'betrokken', omschrijving: '' },
		valkuil: { naam: 'dwepend', omschrijving: '' },
		allergie: { naam: 'onverschillig', omschrijving: '' },
		uitdaging: { naam: 'beschouwend', omschrijving: '' }
	},
	10: {
		kwaliteit: { naam: 'betrouwbaar', omschrijving: 'degelijk, deugdelijk, eerlijk, vertouwd' },
		valkuil: { naam: 'saai', omschrijving: 'eentonig, oninteressant, monotoon' },
		allergie: { naam: 'arbitrair', omschrijving: 'eigendunkelijk, willekeurig, scheidsrechterlijk' },
		uitdaging: { naam: 'innovatief', omschrijving: 'baanbrekend, grensverleggend, vernieuwend' }
	},
	11: {
		kwaliteit: { naam: 'consensusgericht', omschrijving: '' },
		valkuil: { naam: 'egocentrisch', omschrijving: '' },
		allergie: { naam: 'dwang', omschrijving: '' },
		uitdaging: { naam: 'gezagsgetrouw', omschrijving: '' }
	},
	12: {
		kwaliteit: { naam: 'daadkracht', omschrijving: '' },
		valkuil: { naam: 'drammerigheid', omschrijving: '' },
		allergie: { naam: 'passiviteit', omschrijving: '' },
		uitdaging: { naam: 'geduld', omschrijving: '' }
	},
	13: {
		kwaliteit: { naam: 'daadkrachtig', omschrijving: '' },
		valkuil: { naam: 'drammerig', omschrijving: '' },
		allergie: { naam: 'passief', omschrijving: '' },
		uitdaging: { naam: 'geduldig', omschrijving: '' }
	},
	14: {
		kwaliteit: { naam: 'efficiënt', omschrijving: '' },
		valkuil: { naam: 'statisch', omschrijving: '' },
		allergie: { naam: 'chaotisch', omschrijving: '' },
		uitdaging: { naam: 'creatief', omschrijving: '' }
	},
	15: {
		kwaliteit: { naam: 'empathisch', omschrijving: '' },
		valkuil: { naam: 'sentimenteel', omschrijving: '' },
		allergie: { naam: 'afstandelijk', omschrijving: '' },
		uitdaging: { naam: 'beschouwend', omschrijving: '' }
	},
	16: {
		kwaliteit: { naam: 'flexibel', omschrijving: '' },
		valkuil: { naam: 'wispelturig', omschrijving: '' },
		allergie: { naam: 'star', omschrijving: '' },
		uitdaging: { naam: 'ordenend', omschrijving: '' }
	},
	17: {
		kwaliteit: { naam: 'gedisciplineerd', omschrijving: '' },
		valkuil: { naam: 'dwang-neurotisch', omschrijving: '' },
		allergie: { naam: 'ongedisciplineerd', omschrijving: '' },
		uitdaging: { naam: 'los laten', omschrijving: '' }
	},
	18: {
		kwaliteit: { naam: 'gehoorzaam', omschrijving: '' },
		valkuil: { naam: 'slaafs', omschrijving: '' },
		allergie: { naam: 'eigenzinnig', omschrijving: '' },
		uitdaging: { naam: 'autonoom', omschrijving: '' }
	},
	19: {
		kwaliteit: { naam: 'gestructureerd', omschrijving: '' },
		valkuil: { naam: 'bureaucratisch', omschrijving: '' },
		allergie: { naam: 'inconsistent', omschrijving: '' },
		uitdaging: { naam: 'aanpassing', omschrijving: '' }
	},
	20: {
		kwaliteit: { naam: 'gezagsgetrouw', omschrijving: '' },
		valkuil: { naam: 'ja-knikken', omschrijving: '' },
		allergie: { naam: 'anarchistisch', omschrijving: '' },
		uitdaging: { naam: 'concensus', omschrijving: '' }
	},
	21: {
		kwaliteit: { naam: 'harmonisch', omschrijving: '' },
		valkuil: { naam: 'toedekken', omschrijving: '' },
		allergie: { naam: 'conflict', omschrijving: '' },
		uitdaging: { naam: 'direct', omschrijving: '' }
	},
	22: {
		kwaliteit: { naam: 'idealistisch', omschrijving: '' },
		valkuil: { naam: 'zweverig', omschrijving: '' },
		allergie: { naam: 'cynisch', omschrijving: '' },
		uitdaging: { naam: 'realistisch', omschrijving: '' }
	},
	23: {
		kwaliteit: { naam: 'ingetogen', omschrijving: '' },
		valkuil: { naam: 'passief', omschrijving: '' },
		allergie: { naam: 'opdringerig', omschrijving: '' },
		uitdaging: { naam: 'initiatiefrijk', omschrijving: '' }
	},
	24: {
		kwaliteit: { naam: 'innovatief', omschrijving: '' },
		valkuil: { naam: 'zwevend', omschrijving: '' },
		allergie: { naam: 'statisch en star', omschrijving: '' },
		uitdaging: { naam: 'efficiënt', omschrijving: '' }
	},
	25: {
		kwaliteit: { naam: 'kritisch', omschrijving: '' },
		valkuil: { naam: 'rebels', omschrijving: '' },
		allergie: { naam: 'ja-knikken', omschrijving: '' },
		uitdaging: { naam: 'respectvol', omschrijving: '' }
	},
	26: {
		kwaliteit: { naam: 'loyaal gezag', omschrijving: '' },
		valkuil: { naam: 'onderdanig', omschrijving: '' },
		allergie: { naam: 'ongehoorzaam', omschrijving: '' },
		uitdaging: { naam: 'kritisch', omschrijving: '' }
	},
	27: {
		kwaliteit: { naam: 'meegaand', omschrijving: '' },
		valkuil: { naam: 'onzichtbaar', omschrijving: '' },
		allergie: { naam: 'eigengereid', omschrijving: '' },
		uitdaging: { naam: 'autonoom', omschrijving: '' }
	},
	28: {
		kwaliteit: { naam: 'moed(ig)', omschrijving: '' },
		valkuil: { naam: 'roekeloos', omschrijving: '' },
		allergie: { naam: 'aarzelend', omschrijving: '' },
		uitdaging: { naam: 'bedachtzaam', omschrijving: '' }
	},
	29: {
		kwaliteit: { naam: 'optimistisch', omschrijving: '' },
		valkuil: { naam: 'naïef', omschrijving: '' },
		allergie: { naam: 'pessimisme', omschrijving: '' },
		uitdaging: { naam: 'alert', omschrijving: '' }
	},
	30: {
		kwaliteit: { naam: 'ordenend', omschrijving: '' },
		valkuil: { naam: 'star', omschrijving: '' },
		allergie: { naam: 'wispelturig', omschrijving: '' },
		uitdaging: { naam: 'flexibel', omschrijving: '' }
	},
	31: {
		kwaliteit: { naam: 'profilerend', omschrijving: '' },
		valkuil: { naam: 'arrogant', omschrijving: '' },
		allergie: { naam: 'onzichtbaar', omschrijving: '' },
		uitdaging: { naam: 'bescheiden', omschrijving: '' }
	},
	32: {
		kwaliteit: { naam: 'rationeel', omschrijving: '' },
		valkuil: { naam: 'afstandelijk', omschrijving: '' },
		allergie: { naam: 'willekeur', omschrijving: '' },
		uitdaging: { naam: 'betrokken', omschrijving: '' }
	},
	33: {
		kwaliteit: { naam: 'realistisch', omschrijving: '' },
		valkuil: { naam: 'cynisch', omschrijving: '' },
		allergie: { naam: 'zweverig', omschrijving: '' },
		uitdaging: { naam: 'idealistisch', omschrijving: '' }
	},
	34: {
		kwaliteit: { naam: 'relativerend', omschrijving: '' },
		valkuil: { naam: 'onzichtbaar', omschrijving: '' },
		allergie: { naam: 'opgeblazen', omschrijving: '' },
		uitdaging: { naam: 'overtuigd', omschrijving: '' }
	},
	35: {
		kwaliteit: { naam: 'relativeringsvermogen', omschrijving: '' },
		valkuil: { naam: 'lichtzinnigheid', omschrijving: '' },
		allergie: { naam: 'zwaarmoedigheid', omschrijving: '' },
		uitdaging: { naam: 'serieus zijn', omschrijving: '' }
	},
	36: {
		kwaliteit: { naam: 'rust(ig)', omschrijving: '' },
		valkuil: { naam: 'afwachtend', omschrijving: '' },
		allergie: { naam: 'opdringerig', omschrijving: '' },
		uitdaging: { naam: 'initiatiefrijk', omschrijving: '' }
	},
	37: {
		kwaliteit: { naam: 'service-gericht', omschrijving: '' },
		valkuil: { naam: 'grenzeloos', omschrijving: '' },
		allergie: { naam: 'hard en star', omschrijving: '' },
		uitdaging: { naam: 'grens stellen', omschrijving: '' }
	},
	38: {
		kwaliteit: { naam: 'spontaniteit', omschrijving: '' },
		valkuil: { naam: 'wispelturigheid', omschrijving: '' },
		allergie: { naam: 'rechtlijnigheid', omschrijving: '' },
		uitdaging: { naam: 'consequent zijn', omschrijving: '' }
	},
	39: {
		kwaliteit: { naam: 'stabiel', omschrijving: '' },
		valkuil: { naam: 'traag', omschrijving: '' },
		allergie: { naam: 'onbezonnen', omschrijving: '' },
		uitdaging: { naam: 'experimenteel', omschrijving: '' }
	},
	40: {
		kwaliteit: { naam: 'toegewijd', omschrijving: '' },
		valkuil: { naam: 'fanatiek', omschrijving: '' },
		allergie: { naam: 'laissex-faire', omschrijving: '' },
		uitdaging: { naam: 'hulpvaardig', omschrijving: '' }
	},
	41: {
		kwaliteit: { naam: 'volgzaam', omschrijving: '' },
		valkuil: { naam: 'onderdanig', omschrijving: '' },
		allergie: { naam: 'eigengereid', omschrijving: '' },
		uitdaging: { naam: 'initiatiefrijk', omschrijving: '' }
	},
	42: {
		kwaliteit: { naam: 'wederkerig', omschrijving: '' },
		valkuil: { naam: 'gelijkvormig', omschrijving: '' },
		allergie: { naam: 'eenzijdig', omschrijving: '' },
		uitdaging: { naam: 'fair', omschrijving: '' }
	},
	43: {
		kwaliteit: { naam: 'zelfverzekerd', omschrijving: '' },
		valkuil: { naam: 'arrogant', omschrijving: '' },
		allergie: { naam: 'middelmatig', omschrijving: '' },
		uitdaging: { naam: 'bescheiden', omschrijving: '' }
	}
};