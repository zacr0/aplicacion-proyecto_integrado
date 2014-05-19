$(function() {
	// PAGINA DE LOGIN
	var loginForm = $('#form-login');

	$(loginForm).validate({
		errorPlacement: function(label, element) {
			label.addClass('control-label');
			label.insertAfter(element);
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

	// PENDIENTE COMPROBAR VALIDACION

	// PAGINA DE REGISTRO
	$('#fechanacimiento').datepicker({
		format: 'dd/mm/yyyy',
		endDate: new Date($.now()),
		startDate: new Date('01/01/1970'),
		language: 'es',
		minViewMode: 'days',
		weekStart: 1,
		autoclose: true
	});

	$('.visible-alumno').hide();
	$('.visible-profesor').hide();

	$('input[name=perfil]').click(function () {
		if (this.id == "alumno") {
			$(".visible-alumno").show();
			$("#alumno").attr('required') = 
			$(".visible-profesor").hide();
		} 
		if (this.id == "profesor") {
			$(".visible-profesor").show();
			$(".visible-alumno").hide();
		}
	});

	var registroForm = $('#form-registro');
	registroForm.validate({
		errorPlacement: function(label, element) {
			label.addClass('control-label');
			label.insertBefore(element);
		},
		rules: {
			usuario: {
				required: true,
				rangelength: [3,12]
			},
			pass: {
				required: true,
				pwd: true,
				minlength: 6
			},
			nombre: {
				required: true,
				nombre: true,
				minlenght: 3
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

	// PENDIENTE COMPROBAR VALIDACION
	
	/*
		El nombre debe tener 3 o mas letras y puede ser compuesto
	*/
	$.validator.addMethod("nombre", function(value) {
		return /^([a-zA-Z]{3,}\s*)+$/.test(value)
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
});