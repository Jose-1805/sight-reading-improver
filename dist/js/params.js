//pulsos por figura
var p_redonda = 4;
var p_blanca = 2;
var p_negra = 1;
var p_corchea = 0.5;
var p_s_corchea = 0.25;
var p_fusa = p_s_corchea/2;
var p_s_fusa = p_fusa/2;

//cantidad de compaces que se generan en el pentagrama
var number_compasses = 20;
var pulse_compas = 4;//cantidad de pulsos por compas
var pulse_value = p_negra;//indica el valor de cada pulso (4/4 es 4 pulsos de negra ya que 4/4 = 1 y 1 es p_negra)
var pulse_duration = 60/localStorage.getItem('tempo');//en el caso de 60/60 seria una pulsacion por segundo
//indices de las notas
var notes_chars = ['A','B','C','D','E','F','G','A','B','C','D','E','F','G','A','B'];

//se obtiene el valor de las pulsaciones de la figura negra con relacion a la cantidad de pulsos por compas
//y el valor de pulsos de la figura que referencia el valor de cada pulso del compas	
var pulses_negra_compas = (p_negra * pulse_compas)/((pulse_compas * pulse_value)/p_negra);

var ranges = ['p','q','r','s','t','u','v','w','x','y','z','{','|','}','~'];
var keys = ['=','¡','¢'];
var pentagrama_first_line = '<div class="linea_pentagrama margin-top-50"><span class="musiqwik">=</span><span class="musiqwik">&</span><span class="musiqwik">=</span><span class="musiqwik">4</span><span class="musiqwik">=</span></div>';
var pentagrama_line = '<div class="linea_pentagrama margin-top-50"><span class="musiqwik">=</span><span class="musiqwik">&</span><span class="musiqwik">=</span><span class="musiqwik">=</span></div>';
//cantidad de espacios bloqueados al inicio de una linea de pentagrama
var locked_spaces = 5;
//cantidad de espacios disponibles para una linea
var line_spaces = 50;
//cantidad minima de espacios para llenar un compas
var min_spaces_compas = 10;

var notes = {
				//blanca
				'h':{
						'number_sounds':1,//cantidad de sonidos
						'class':['musiqwik'],//clase que incluye la fuente de las figuras por cada sonido
						'duration':[2],//duracion de cada sonido
						'number_pulses':[p_blanca],//cantidad de pulsos por figura

						//fuente emisora de cada sonido, equivalente a la cantidad de sonidos
						'chars': [
							['`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'],
						]
					},	

				//negra	
				'q':{
						'number_sounds':1,//cantidad de sonidos
						'class':['musiqwik'],//clase que incluye la fuente de las figuras por cada sonido
						'duration':[4],//duracion de cada sonido
						'number_pulses':[p_negra],//cantidad de pulsos por figura

						//fuente emisora de cada sonido, equivalente a la cantidad de sonidos
						'chars': [
							['P','Q','R','S','T','U','V','W','X','Y','Z','[','\\',']','^','_'],
						]
					},	

				//negra	con puntillo 
				'j':{
						'number_sounds':1,//cantidad de sonidos
						'class':['musiqwik'],//clase que incluye la fuente de las figuras por cada sonido
						'duration':[4],//duracion de cada sonido
						'number_pulses':[p_negra * 1.5],//cantidad de pulsos por figura

						//fuente emisora de cada sonido, equivalente a la cantidad de sonidos
						'chars': [
							['P°','Q±','R²','S³','T´','Uµ','V¶','W·','X¸','Y¹','Zº','[»','\\¼',']½','^¾','_¿'],
						]
					},		

				//agrupacion de 2 corcheas
				'n':{
						'number_sounds':2,//cantidad de sonidos
						'class':['musiqwik','musiqwik'],//clase que incluye la fuente de las figuras por cada sonido
						'duration':[8,8],//duracion de cada sonido
						'number_pulses':[p_corchea,p_corchea],//cantidad de pulsos por figura

						//fuente emisora de cada sonido, equivalente a la cantidad de sonidos
						'chars': [
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
						]
					},	

				//sin definor
				'T':{
						'number_sounds':3,//cantidad de sonidos
						'class':['musiqwik','musiqwik','musiqwik'],//clase que incluye la fuente de las figuras por cada sonido
						'duration':[4,4,4],//duracion de cada sonido
						'number_pulses':[p_corchea,p_corchea,p_corchea],//cantidad de pulsos por figura

						//fuente emisora de cada sonido, equivalente a la cantidad de sonidos
						'chars': [
							['`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'],
							['`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'],
							['`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'],
						]
					},

				//union de dos semicorcheas y una corchea	
				'M':{
						'number_sounds':3,//cantidad de sonidos
						'class':['musiqwikb','musiqwikb','musiqwik'],//clase que incluye la fuente de las figuras por cada sonido
						'duration':[16,.16,8],//duracion de cada sonido
						'number_pulses':[p_s_corchea,p_s_corchea,p_corchea],//cantidad de pulsos por figura

						//fuente emisora de cada sonido, equivalente a la cantidad de sonidos
						'chars': [
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
						]
					},

				//union de una corchea y dos semicorcheas
				'm':{
						'number_sounds':3,//cantidad de sonidos
						'class':['musiqwik','musiqwikb','musiqwikb'],//clase que incluye la fuente de las figuras por cada sonido
						'duration':[8,16,16],//duracion de cada sonido
						'number_pulses':[p_corchea,p_s_corchea,p_s_corchea],//cantidad de pulsos por figura

						//fuente emisora de cada sonido, equivalente a la cantidad de sonidos
						'chars': [
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
						]
					},	

				//union de 4 semicorcheas
				'y':{
						'number_sounds':4,//cantidad de sonidos
						'class':['musiqwikb','musiqwikb','musiqwikb','musiqwikb'],//clase que incluye la fuente de las figuras por cada sonido
						'duration':[16,16,16,16],//duracion de cada sonido
						'number_pulses':[p_s_corchea,p_s_corchea,p_s_corchea,p_s_corchea],//cantidad de pulsos por figura

						//fuente emisora de cada sonido, equivalente a la cantidad de sonidos
						'chars': [
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
						]
					},	

				//union de una corchea con con puntillo y una semicorchea
				'o':{
						'number_sounds':2,//cantidad de sonidos
						'class':['musiqwik','musiqwikb'],//clase que incluye la fuente de las figuras por cada sonido
						'duration':[8,16],//duracion de cada sonido
						'number_pulses':[p_corchea*1.5,p_s_corchea],//cantidad de pulsos por figura

						//fuente emisora de cada sonido, equivalente a la cantidad de sonidos
						'chars': [
							['@°','A±','B²','C³','D´','Eµ','F¶','G·','H¸','I¹','Jº','K»','L¼','M½','N¾','O¿'],
							['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'],
						]
					},	
};