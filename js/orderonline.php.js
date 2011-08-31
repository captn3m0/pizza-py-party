//inline js @ orderonline.php
function confirmLogin()
{
     var mobile = $('#txtMobileNo').val();
     var password = $('#txtPassword').val();
     var error = 0;
     var errormessage = '<h3 style="padding-left:10px;">Error!</h3><p style="padding:10px">';
    if(mobile.length != 10 )
        {
            error = 1;
            errormessage = errormessage + 'Please enter a valid mobile number<br />';
        }
    if(password == '')
    {
            error = 1;
            errormessage = errormessage + 'Please enter a password<br />';
    }

     if(error == 1)
     {
        $.prompt(errormessage+'</p>');
     }
    else

    {
       var dataString = 'txtMobileNo='+ mobile+'&password='+password;
        $('#blocker').css('display','block');
        $.ajax
        ({
            type: "POST",
            url: "verifylogin.php",
            data: dataString,
            cache: false,
            success: function(html)
            {
                if(html=="1")
                {
                   window.location='dashboard.php?r=1';
                }
                else
                {
                    $('#blocker').css('display','none');
                   $.prompt('<h3 style="padding-left:10px;">Error!</h3><p style="padding:10px">You have entered an incorrect mobile number / password.<br />Kindly try again or click on "Forgot Password" to retreive it</p>');
                }

            }
        });
    }
    }
function submitForgotPassword()
{
    var mobile = $('#fpMobile').val();
    $.fancybox.close();
    if(mobile.length == 10 )
        {

            var dataString = 'fpMobile='+ mobile;
            $('#blocker').css('display','block');
            $.ajax
            ({
                type: "GET",
                url: "requestpin.php",
                data: dataString,
                cache: false,
                success: function(html)
                {
                    if(html=="1")
                    {
                       $('#blocker').css('display','none');
                       $.prompt('<h3 style="padding-left:10px;">Success!</h3><p style="padding:10px">Password sent successfully to you registered Email ID</p>');
                    }
                    else
                    {
                       $('#blocker').css('display','none');
                       $.prompt('<h3 style="padding-left:10px;">Error!</h3><p style="padding:10px">The mobile number you have entered is not registered with us. If you are ordering for the first time kindly use the "first time order" section');
                    }

                }
            });
        }

    else

        {
           $.prompt('<h3 style="padding-left:10px;">Error!</h3><p style="padding:10px">Please enter a valid mobile number</p>');
        }

}


function setStreetNameValue()
 {
  var streetName = $('#txtStreetName').val();
   if(streetName == '' || streetName == 'Street / Society Name')
     {
        $('#txtStreetName').val('');
     }

 }

 function removeStreetNameValue()
 {
     var streetName = $('#txtStreetName').val();
     if(streetName == '' || streetName == 'Street / Society Name')
     {
        $('#txtStreetName').val('Street / Society Name');
     }
 }

 function setHouseNoValue()
 {
     var flatNo = $('#txtFlatNo').val();
     if(flatNo == '' || flatNo == 'Flat / House No.')
     {
      $('#txtFlatNo').val('');
     }
 }

 function removeHouseNoValue()
 {
     var flatNo = $('#txtFlatNo').val();
     var flatNo = $('#txtFlatNo').val();
     if(flatNo == '' || flatNo == 'Flat / House No.')
     {
        $('#txtFlatNo').val('Flat / House No.');
     }
 }
 
 function changeOrderType(orderType)
{
    if(orderType == 'P')
    {
        $('#pickup').css('display','block');
        $('#homedelivery').css('display','none');
    }
    else
    {
        $('#pickup').css('display','none');
        $('#homedelivery').css('display','block');
    }
}


function confirmAddressSubmission()
{

     var streetName = $('#txtStreetName').val();
     var houseNo = $('#txtFlatNo').val();

     var error_message = '<h3 style="padding-left:10px;">Error!</h3><p style="padding:10px">';
     var error = 0;

     if (streetName == 'Street / Society Name' || streetName == '')
     {
         error_message = error_message + 'Please enter a Street / Society name<br />';
         error = 1;
     }
     if (houseNo == 'Flat / House No.' || houseNo == '')
     {
         error_message = error_message + 'Please enter a Flat / House No<br />';
         error = 1;
     }
     error_message = error_message+'</p>';

     if(error == 1)
     {
         $.prompt(error_message);
     }

     else
     {
        $('#homedeliveryform').submit();
     }
}
