var beat = null;
var beat_bar = null;
var state_metronomo = 'stop';
var metronomo_counter = 0;
var metronomo_limit_bar = 4;
//de 0.0 a 1
var metronomo_volume = .5;

//var reproductor = Synth.createInstrument('piano');
var index_play = 0;
var length_melody = 0;
var state = 'stop';
var currentTimeOut = 0;
var default_octava = 3;
//Establecer la frecuencia de muestreo 4000Hz and 44100Hz.
Synth.setSampleRate(44100);
//Establecer volume 1 = 100%
Synth.setVolume(1.00);

var piano = Synth.createInstrument('piano');
var acoustic = Synth.createInstrument('acoustic');
//var organ = Synth.createInstrument('organ');
var edm = Synth.createInstrument('edm');
var instrument = 'piano';

$(function (argument) {
	length_melody = $('.sound_element').length;
	$('#btn-play').click(function(){
		if(state == 'stop' || state == 'pause'){
			state = 'play';
			play();
		}
	})

	$('#btn-backward').click(function(){
		if(state == 'play' || state == 'pause'){
			state = 'reset';
			resetPentagrama();
			setTimeout(function(){
				state = 'play';
				play();
			},currentTimeOut + 100);
		}
	})

	$('#btn-stop').click(function(){
		if(state == 'play' || state == 'pause'){
			state = 'stop';
			resetPentagrama();
		}
	})

	$('#btn-pause').click(function(){
		if(state == 'play'){
			state = 'pause';
			pasueMetronomo();
		}
	})

	$('.btn-instrumento').click(function(){
		instrument = $(this).data('option');
	})

	$('.btn-toggle-instruments').click(function(){
		$('.btn-instrumentos').toggleClass('d-none');
	})

	beat = document.getElementById('metro_beat');
	beat_bar = document.getElementById('metro_bar');

	beat.volume = metronomo_volume;
	beat_bar.volume = metronomo_volume;
	
})

function playMetronomo(){
	if(state_metronomo == 'play'){
		metronomo_counter++;
		if(metronomo_counter == 1){
			beat_bar.play();
		}else{
			if(metronomo_counter == metronomo_limit_bar)metronomo_counter = 0;
			beat.play();
		}

		setTimeout(function(){
			if(state_metronomo == 'play'){
				playMetronomo();
			}else if(state_metronomo == 'stop'){
				metronomo_counter = 0;
				console.log('metronomo detenido');
			}else{
				console.log('metronomo pausado');
			}
		}, (60 / localStorage.getItem('tempo')) * 1000);	
	}else{
		state_metronomo = 'play';
		setTimeout(function(){
			playMetronomo();		
		}, 10);
	}


	
}	

function stopMetronomo(){
	state_metronomo = 'stop';
}

function pasueMetronomo(){
	state_metronomo = 'pause';
}

function play(){
	if(state == 'play'){

		if(state_metronomo == 'stop'){
			playMetronomo();
			setTimeout(function(){
				play();
			},(60 / localStorage.getItem('tempo')) * 4000);

			return true;
		}else if(state_metronomo == 'pause'){
			playMetronomo();
		}

		var element_sound = $('.sound_element').eq(index_play);

		var element_sound_next = $('.sound_element').eq(index_play+1);

		if(!element_sound_next.length)element_sound_next = element_sound;

		var inicio_pantalla = $(document).scrollTop();
        var altura_controles = $('#controles').innerHeight();
	    var fin_pantalla = inicio_pantalla + window.innerHeight - altura_controles;
        var posicion = $(element_sound_next).parent().offset().top;
        var altura = $(element_sound_next).parent().innerHeight();
        //la linea no esta dentro de la pantalla
        if(
            !((posicion >= inicio_pantalla && posicion <= fin_pantalla) //la parte inicial de la linea esta dentro de la pantalla
            && (posicion + altura >= inicio_pantalla && posicion + altura <= fin_pantalla)) //la parte final de la linea esta dentro de la pantalla
        ){
            //$(document).scrollTop(posicion);
	        $('html, body').stop().animate({scrollTop:posicion-20}, 500, 'swing');
        }

		var index_note = $(element_sound).data('note');
		var note = notes_chars[index_note];
		var duration = $(element_sound).data('duration');
		var octava = default_octava; 
		if(index_note >= 9 ){
			octava = default_octava + 1;
		}else if(index_note < 2){
			octava = default_octava - 1;
		}

		$(element_sound).html('=');

		setTimeout(function(){
			eval(instrument).play(note, octava, duration*1.3);
		},120);
		
		if(index_play < (length_melody - 1)){
			index_play++;
			currentTimeOut = duration*1000;
			setTimeout(function(){
				play();
			},currentTimeOut);
		}else{
			setTimeout(function(){
				resetPentagrama();
				state = 'stop';
			},800);
		}
	}
}

function resetPentagrama(){
	$('.sound_element').each(function(i,el){
		$(el).html($(el).data('previous'));
	})
	index_play = 0;
	stopMetronomo();
}