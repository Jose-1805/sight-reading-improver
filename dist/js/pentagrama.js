var line_spaces_aux = 0;
$(function() {
	if(
		localStorage.getItem('range_max') === null ||
		localStorage.getItem('range_min') === null ||
		localStorage.getItem('key') === null ||
		localStorage.getItem('tempo') === null ||
		localStorage.getItem('figures_selected') === null
	)window.location.href = 'index.html';

	cargarPentagrama();
})

//retorna una figura musical para dibujar en el pentagrama
function getNoteFigure(figure){
	//trae toda la info de la figura
	var data = notes[figure];
	var html = '';
	//se utiliza para contar la cantidad de pulsos ocupados por la figura
	var number_pulses_aux = 0;

	var spaces_used = 0;

	//ciclo por cada sonido que contiene la figura
	for(i = 0;i<data.number_sounds;i++){
		//clase css asignada para representar la figura
		var class_ = data.class[i];
		//Caracteres posibles para altitud de la figura
		var chars = data.chars[i];
		
		var max_range = ranges.indexOf(localStorage.getItem('range_max'));
		var min_range = ranges.indexOf(localStorage.getItem('range_min'));

		//caracter representante de la figura en su respectiva altura
		//var char_index = Math.floor(Math.random() * chars.length);
		var char_index = Math.floor(Math.random() * ((max_range+1) - min_range) + min_range);
		var note = chars[char_index];

		//cantidad de pulsos de la figura
		var pulse_aux = data.number_pulses[i];

		number_pulses_aux += pulse_aux;

		//se define la duracion del sonido
		var number_pulses_figure = ((pulse_aux * pulse_compas)/((pulse_compas * pulse_value)/pulse_aux))/pulse_aux;
		var duration = number_pulses_figure * pulse_duration;

		html += '<span data-duration="'+duration+'" data-pulses="'+pulse_aux+'" data-note="'+char_index+'" class="'+class_+' sound_element" data-previous="'+note+'">'+note+'</span><span class="'+ class_+'">=</span>';

		//se suma la cantidad de caracteres utilizados mas el espacio agregado al final
		spaces_used += note.length + 1;
	}

	//se obtiene el valor de las pulsaciones de la figura con relacion a la cantidad de pulsos por compas
	//y el valor de pulsos de la figura que referencia el valor de cada pulso del compas
	number_pulses_aux = ((number_pulses_aux * pulse_compas)/((pulse_compas * pulse_value)/number_pulses_aux))/number_pulses_aux;
	return [html,number_pulses_aux,spaces_used];
}

function cargarPentagrama(){

	var generado = false;
	var cont_intentos = 0;
	var intentos = 10;

	while(!generado){
		//figuras seleccionadas en la primera vista
		var figures_selected = JSON.parse(localStorage.getItem('figures_selected'));
		var fail = false;
		var fails = 0;

		var current_line = 0;
		var filled_spaces = 0;

		//se agrega la primera linea
		$('.pentagrama').html(pentagrama_first_line);
		line_spaces_aux = line_spaces;
		//ciclo para dibujar compases
		for(var i = 0; i < number_compasses; i++){
			//cuenta el numero de pulsos, cuando es igual al la cantidad requerida por compas finaliza el compas
			var number_pulses = 0;
			//identifica cuando se ha dibujado un compas completo en el pentagrama
			var full_compas = false;
			while(!full_compas){
				//una figura al azar de las seleccionadas en la primera vista
				var random = Math.floor(Math.random() * figures_selected.length);
				var data_figures = getNoteFigure(figures_selected[random]);

				//la cantidad de pulsos de la nueva figura completa el compas
				if((number_pulses + data_figures[1]) == pulse_compas){
					number_pulses += data_figures[1];
					$('.pentagrama .linea_pentagrama').eq(current_line).append(data_figures[0]);
					filled_spaces += data_figures[2];

					//si finaliza la melodia
					if(i == number_compasses -1){
						rellenarEspacios(current_line,true);
					}else{
						//se determina si queda espacio para un nuevo compas
						if((line_spaces_aux - (filled_spaces + 1) >= min_spaces_compas) ){
							//si se abre un nuevo compas
							$('.pentagrama .linea_pentagrama').eq(current_line).append('<span class="musiqwik">=</span><span class="musiqwik">!</span><span class="musiqwik">=</span>');
							filled_spaces += 3;
						}else{
							//se rellenn los espacios faltantes
							rellenarEspacios(current_line);	
							//se cambia la linea
							current_line++;
							//se suman espacios ya que no va el 4/4
							line_spaces_aux = line_spaces + 1;
							//se agrega una nueva linea
							$('.pentagrama').append(pentagrama_line);
							filled_spaces = 0;
						}
					}
					full_compas = true;
				//el total de los pulsos hasta este momento no completa los pulsos del compas
				}else if((number_pulses + data_figures[1]) < pulse_compas){

					//se debe dejar un numero de pulsos libre (negra) para llenar el compas exactamente
					if((number_pulses + data_figures[1]) <= (pulse_compas - pulses_negra_compas)){

						//se debe contar con 5 espacios para finalizar el compas
						if((filled_spaces + data_figures[2]) > (line_spaces_aux - 5)) {
							fails++;
							if(fails >= 100){
								fail = true;
								full_compas = true;
							}
						}else{
							number_pulses += data_figures[1];	
							filled_spaces += data_figures[2];
							$('.pentagrama .linea_pentagrama').eq(current_line).append(data_figures[0]);
						}
					}else{
						//no esta quedando un pulso de (1) para el llenado preciso
						//se cuenta como falla, despues de 100 fallas se descarta la melodia y se lanza un error
						fails++;
						if(fails >= 100){
							fail = true;
							full_compas = true;
						}
					}
				}else{
					//la cantidad de pulsos sumando la figura actual sobrepasa en limite de pulsos
					//se descarta la figura
					//se cuenta como falla, despues de 100 fallas se descarta la melodia y se lanza un error
					fails++;
					if(fails >= 100){
						fail = true;
						full_compas = true;
					}	
				}
			}
			if(fail)break;

		}

		if(fail){
			cont_intentos++;
			if(cont_intentos >= intentos){
				$('.pentagrama').eq(0).remove();
				$('#alerta-melodia').removeClass('d-none');
				generado = true;
			}
		}else{
			generado = true;
		}
	}
	
	/*var figures_selected = JSON.parse(localStorage.getItem('figures_selected'));

	for (var i = figures_selected.length - 1; i >= 0; i--) {
		$('#melodia').html($('#melodia').html()+getNoteFigure(figures_selected[i]));
	}*/
}

/**
*	Completa una linea de pentagrama con espacios en blanco
*
*	@line => Linea a rellenar a partir de indice 0
*/
function rellenarEspacios(line,last=false){
	var current_spaces = $('.pentagrama .linea_pentagrama').eq(line).children('span').length;
	var new_spaces = ((line_spaces_aux + locked_spaces) - current_spaces) - 1;

	for(i = 0;i < new_spaces;i++){
		$('.pentagrama .linea_pentagrama').eq(line).append('<span class="musiqwik">=</span>');
	}

	if(last)
		$('.pentagrama .linea_pentagrama').eq(line).append('<span class="musiqwik">"</span>');
	else
		$('.pentagrama .linea_pentagrama').eq(line).append('<span class="musiqwik">!</span>');

}