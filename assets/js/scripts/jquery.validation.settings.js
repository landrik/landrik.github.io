(function ($) {
    "use strict";
    var nameDefault = $(this).attr('placeholder'),
        emailDefault = $(this).attr('placeholder'),
        messageDefault = $(this).attr('placeholder'),
        projTypeDefault = $("projType").val(),
        projBudgetDefault = $("input#budget").val(),
        projDescDefault = $(this).attr('placeholder'),
        heloRules = {},
        quoteRules = {};
    
    function setupDefaultText(fieldID, fieldDefault) {
        $(fieldID).val(fieldDefault);
        $(fieldID).attr('data-default', fieldDefault);
    }
    function evalDefault(fieldID) {
        if ($(fieldID).val() !== $(fieldID).attr('data-default')) {
            return false;
        } else {
            return true;
        }
    }
    function focusField(fieldID) {
        $(fieldID).focus(function (evaluation) {
            if (evalDefault(fieldID)) {
                $(fieldID).val('');
            }
        }).blur(function (evaluation) {
            if (evalDefault(fieldID) || $(fieldID).val() === '') {
                $(fieldID).val($(fieldID).attr('data-default'));
            }
        });
    }
    function setupforms() {
        setupDefaultText('#name', nameDefault);
        setupDefaultText('#email', emailDefault);
        setupDefaultText('#message', messageDefault);
        setupDefaultText('#projType', projTypeDefault);
        setupDefaultText('#projBudget', projBudgetDefault);
        setupDefaultText('#projDesc', projDescDefault);
        
        focusField('#name');
        focusField('#email');
        focusField('#message');
        focusField('#projDesc');
    }
    function getSubject() {
        return $("#form-contact").find("input[name=subject]:checked").val();
    }
    function hasDefaults(formType) {
        switch (formType) {
            case 'hello':
                if (evalDefault('#name') && evalDefault('#email') && evalDefault('#message')) {
                return true;
            } else {
                return false;
            }
                break;
            case 'quote': 
                if (evalDefault('#name') && evalDefault('#email') && evalDefault('#projType') && evalDefault('#projBudget') && evalDefault('#projeDesc')) {
                return true;
            } else {
                return false;
            }
                break;
            default: return false;
        }
    }
    function validateContact() {
        if (!$('#form-contact').valid()) {
            return false;
        } else {
            return true;
        }
    }
    $('.submit-contact').click(function (event) {
        event.preventDefault();
    });
    $('#submit-contact').bind('click', function () {
        if (!hasDefaults('contact')) {
            $('#form-contact').submit();
        }
    });
    $("#form-contact").validate({
        rules: {
            name: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
                email: true
            },
            message: {
                required: function (e) {
                    return (getSubject() === 'hello');
                },
                minlength: 10
            },
            projType: {
                required: function (e) {
                    return $("input[name=projType]:checked").length > 0;
                }
            },
            projBudget: {
                required: function (e) {
                    return (getSubject() === 'quote');
                }
            },
            projDesc: {
                required: function (e) {
                    return (getSubject() === 'quote');
                },
                minlength: 10
            }
        },
        messages: {
            name: {
                required: "come on, you have a name don't you?",
                minlength: "Name must have at least 3 characters."
            },
            email: {
                required: "no email, no message",
                email: "This is not a valid email address format."
            },
            message: {
                required: "um...yea, you have to write something to send this form.",
                minlength: "thats all? really?"
            },
            projType: {
                required: "Please select at least one type of project."
            },
            projDesc: {
                required: "um...yea, I need bit of more details for your project really!",
                minlength: "thats all? really?"
            }
        },

        errorPlacement: function (error, element) {
            var errorText = error.text();
            element.parent().find('label').text(errorText);
        },
        highlight: function (element) {
            $(element).parent().addClass("error");
        },
        unhighlight: function (element) {
            $(element).parent().removeClass("error");
        }
    });
    $("#form-contact").ajaxForm({
        beforeSubmit: validateContact,
        dataType: 'html',
        type: "POST",
        url: "assets/lib/contact-form-process.php",
        data: $(this).serialize(),
        success: function () {
            $('#form-contact :input').attr('disabled', 'disabled');
            $('#form-contact').fadeTo("slow", 0.15, function () {
                $(this).find(':input').attr('disabled', 'disabled');
                $(this).find('label').css('cursor', 'default');
                var name = $('#name').val();
                $('#success').fadeIn().html(
                    '<span><h3>Congratulations!</h3> <p>Kind <strong>' + name + '</strong>,<br /> Your message was sent successfully! <br /> I will be in touch as soon as I can <br /> <br /> Thank you,<br /><br />Landry Karege</p></span>'
                );
            });
        },
        error: function () {
            $('#form-contact').fadeTo("slow", 0.15, function () {
                $(this).find(':input').attr('disabled', 'disabled');
                $(this).find('label').css('cursor', 'default');
                $('#error').fadeIn();
            });
        }
    });
    setupforms();
})(jQuery);