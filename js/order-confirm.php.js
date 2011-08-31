//inline js @ order-confirm.php

function changeQuantityStatus(checkboxID)
    {
            
          if ($('#'+checkboxID).attr('checked') == true)
          {   
              $('#tryorder').val('yes') ;
              var productid = $('#'+checkboxID).val();  
              $('#'+'enable'+productid).val('yes');
              $('#'+'quantity'+productid).val('1');
              $('#'+'quantityvalue'+productid).val('1');
          }
          
          else
          {
             var productid = $('#'+checkboxID).val();
              $('#'+'enable'+productid).val('no') ;
              $('#'+'quantity'+productid).val('0');
              $('#'+'quantityvalue'+productid).val('0');
          }
    }

function  changeQuantity(changeType,valueID)   
{                                  
    if($('#'+'enable'+valueID).val() == 'no')
    {
        return false;
    }
    
    if($('#'+'enable'+valueID).val() == 'yes')
    {                                 
        if(changeType == 'down')
        {
           if($('#'+'quantity'+valueID).val() == 1)
           {                        
               return false;
           }
            else
            {    
                var quantity = $('#'+'quantity'+valueID).val();
                quantity = parseInt(quantity); 
                 quantity = quantity - 1; 
                $('#'+'quantity'+valueID).val(quantity);
                $('#'+'quantityvalue'+valueID).val(quantity);
            }
        }
        
        else
        {                      
            var quantity = $('#'+'quantity'+valueID).val();
            quantity = parseInt(quantity);
            quantity = quantity + 1;
            $('#'+'quantity'+valueID).val(quantity);  
            $('#'+'quantityvalue'+valueID).val(quantity);  
        }
    } $(document).ready(function() {
        $("#cart_carousel").jcarousel({
            vertical: true,
            scroll: 1,
            visible: 2
        });
        jQuery('#list1a').accordion({
            autoheight: false,
            clearStyle: true,
            header: 'a'
        });

        jQuery('#list1b').accordion({
            autoheight: false,
            clearStyle: true,
            header: 'a'
        });
        
        $('#done-edit-cart-item').click(function(){
            showPageBlocker();
            if(!checkToppingLogic()) return;
            var customer_basket_id = $(this).siblings('#hidden-basket-id').val();
            crust_type = $('#list1b input:checked').siblings('input[name="attributes_hidden"]').val();
            if(typeof crust_type == "undefined"){
                return false;
            }
            product_string = open_product_id+"#"+crust_type;
            toppings_type = $('#list1a input:checked').siblings('input[name="hidden_attributes"]');
            for(i=0;i< toppings_type.length ;i++){
                product_string +=','+toppings_type[i].value;
            }
            session_id = $.cookie("session_id");
            item_quantity = $('#modal-quantity-item').val();
            
            $.post("updateCartItem.php",{pro_string:product_string,session_id:session_id,basq:item_quantity,cust_basket_id:customer_basket_id},function(data){
                data = eval(data);
                if(data["update_status"]==1){
                    
                    $.fancybox.close();
                    $.post("viewCartItems.php",{session_id:$.cookie("session_id")},function(data){
                        displayCartItems(eval(data));
                        hidePageBlocker();  
                        $.prompt('<h3 style="padding-left:10px;">Item Updated</h3><p style="padding:10px">Your pizza has been updated.</p>');   
                    });
                    
                }
            });
            
        });
    });
</script>

<script type="text/javascript">
    $(document).ready(function() {
        $("#review_order_carousel").jcarousel({
            vertical: true,
            scroll: 1,
            visible: 2
        });
    });
}



  function confirmCustomerDetailsSubmission() 
{   
    var firstname = $('#firstname').val();           
    var lastname = $('#lastname').val();           
    var email = $('#email').val();           
    var mobile = $('#mobile').val();
    var error = 1;                             
    
    var emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 
    var namePattern = /^[a-zA-Z]+$/;
    var mobilePattern = /^[0-9]+$/;
              
    var error_message = '<h3 style="padding-left:10px;">Error!</h3><p style="padding:10px">';
    if(firstname == 'First Name' || firstname == '' )
    {
       error_message  = error_message + 'Please enter your First Name<br />';  
       error = 0; 
    }
    
    else
    {                                
        if(namePattern.test(firstname)== false)
        {                      
            error_message  = error_message + 'First Name can only contain alphabets<br />';
            error = 0;
        }
    }
    
    if(lastname == 'Last Name' || lastname == '' )
    {
       error_message  = error_message + 'Please enter your Last Name<br />';  
       error = 0; 
    }
    
    else
    {
        if(namePattern.test(lastname)== false)
        {
            error_message  = error_message + 'Last Name can only contain alphabets<br />';
            error = 0;
        }
    }
    
    if(email == '' ||  emailPattern.test(email)== false)
    {
       error_message  = error_message + 'Please enter a valid Email ID<br />';  
       error = 0;
    }
    
    if(mobile.length!=10 || mobilePattern.test(mobile)== false )
    {
      error_message  = error_message + 'Please enter a valid mobile number<br />';
      error = 0;   
    }
    
    
    if(error == 1)   
     
    {                     
        $('#userdetails').submit(); 
    }
    
    else
   { 
       $.prompt(error_message+'</p>');
   }
   
}


