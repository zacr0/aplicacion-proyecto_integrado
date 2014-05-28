$(function() {
// PAGINA DE LOGIN
	$('#form-login').validate({
		errorPlacement: function(label, element) {
			label.insertAfter(element);
			label.addClass('control-label');
			$(element).parent().addClass('has-error');
		},
		unhighlight: function (element) {
			$(element).parent().removeClass('has-error');
		},
		rules: {
			usuario: {
				required: true
			},
			pass: {
				required: true
			}
		}
	});

// PAGINA DE REGISTRO
	$(function(){
		$('#fechanacimiento').datepicker({
			format: 'mm/dd/yyyy',
			endDate: new Date($.now()),
			startDate: new Date('01/01/1970'),
			language: 'es',
			minViewMode: 'days',
			weekStart: 1,
			autoclose: true
		});
	});
	
	$('.visible-alumno').hide();
	$('.visible-profesor').hide();

	$('input[name=perfil]').click(function () {
		if (this.checked && this.id == "alumno") {
			$(".visible-alumno").show();
			$("#alumno").prop('required');
			$("input[name=asignatura]").prop('checked', false);
			$(".visible-profesor").hide();
		} 
		if (this.checked && this.id == "profesor") {
			$(".visible-profesor").show();
			$("select#promocion :selected").removeAttr("selected");
			$("select#curso :selected").removeAttr("selected");
			$(".visible-alumno").hide();
		}
	});

	$('select[name=promocion]').change(function(){
		// Obtencion del curso de la promocion
		var curso = $(this).val().split(" ")[0];
		// Deshabilita los cursos que no corresponden
		$('select[name=curso] option')
			.not(':contains(' + curso + ')')
			.prop('disabled', true)
			.prop('selected', false)
			.hide();
		// Habilita los cursos de la promocion que corresponden
		$('select[name=curso] option:contains(' + curso + ')')
			.prop('disabled', false)
			.show();
	});

	$('#form-registro').validate({
		errorPlacement: function(label, element) {
			label.insertAfter(element);
			label.addClass('control-label');
			$(element).parent().addClass('has-error');
		},
		unhighlight: function (element) {
			$(element).parent().removeClass('has-error');
		},
		rules: {
			usuario: {
				usuario: true,
				required: true,
				rangelength: [3,12]
			},
			pass: {
				required: true,
				pwd: true,
				minlength: 6
			},
			confirmpass: {
				required: true,
				equalTo: '#pass'
			},
			nombre: {
				required: true,
				nombre: true,
				minlength: 3
			},
			apellidos: {
				required: true,
				nombre: true,
				minlength: 3
			},
			email: {
				required: true,
				email: true
			},
			fechanacimiento: {
				date: true
			}
			// Validacion de promocion/curso/asignaturas:
		},
		messages: {
			usuario: {
				usuario: "El nombre de usuario sólo puede contener minúsculas \
					y números, y una longitud 3 a 12 caracteres."
			},
			pass: {
				pwd: "La contraseña debe tener al menos 6 caracteres, \
					una minúscula, una mayúscula y un número."
			},
			nombre: {
				nombre: "El nombre sólo puede contener letras."
			},
			apellidos: {
				nombre: "Los apellidos sólo pueden contener letras."
			}
		}
	});
	
	/*
		El nombre de usuario debe tener:
		 - Entre 3 y 12 caracteres.
		 - Minusculas o numeros, o ambos.
	*/
	$.validator.addMethod("usuario", function(value) {
		return /^[a-z\d_]{3,12}$/.test(value);
	});
	// El nombre debe tener 2 o mas letras y puede ser compuesto
	$.validator.addMethod("nombre", function(value) {
		return /^([a-zA-Z\ \'\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1\u00FC\u00DC]{2,}\s*)+$/.test(value);
	});
	/*
		La contraseña debe tener:
		 - Al menos 6 caracteres
		 - Una minuscula
		 - Una mayuscula
		 - Un numero
	*/
	$.validator.addMethod("pwd", function(value) {
		return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(value);
	});

// PAGINA DE SALAS 
	
// PAGINA DE ANUNCIOS
	$('#form-anuncios').validate({
		errorPlacement: function(label, element) {
			label.insertAfter(element);
			label.addClass('control-label');
			$(element).parent().addClass('has-error');
		},
		unhighlight: function (element) {
			$(element).parent().removeClass('has-error');
		},
		rules: {
			titulo: {
				required: true,
				maxlength: 48
			},
			cuerpo: {
				required: true,
				maxlength: 200
			}
		}
	});

	// Confirmacion para eliminar anuncios
	/*$('#eliminar').submit(function(event){
		if (!confirm("Vas a eliminar este mensaje, ¿estás seguro?")) {
			event.preventDefault();
		} else {
			// Recarga la pagina
			location.reload();
		}
	});*/

	$('#btnConfirmar').click(function(event){
		//$('#eliminar').submit();
		return false;
	});

	//$('#your-modal').on('show.bs.modal', function (e) {
  	//	var $invoker = $(e.relatedTarget);
	//});

// PAGINA DE USUARIOS
	$('ul.nav li.disabled a').click(function(){
		return false;
	});
});