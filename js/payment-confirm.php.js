//inline js @payment-confirm.php
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
    
    function confirm(formID)
{
   var check = $('#tandcCash').attr('checked');
    if(check == true)
        {
            var totalPrice = $('#ttlprice').val();
            if(totalPrice > 5000)
            {
               $.prompt('<h3 style="padding-left:10px;">Error!</h3><p style="padding:10px">The total amount for cash orders cannot be more than Rs.5000.<br />Kindly edit your cart to reduce the amount or choose another payment option</p>');
            }
            else
            {
                $.prompt('<h3 style="padding-left:10px;">Please Wait..</h3><p style="padding:10px">Validation in progress... Please do not refresh </p><p style="padding-bottom:10px" align="center"><img src="images/redirect.gif" alt="Redirecting..." /></p>');
                $(".jqidefaultbutton").css('display','none');
                $(".jqiclose").css('display','none');
                $.get('verifycustomer.php', function(data) {
                    if(data.msg == '1') {
                     $('#cashForm').submit();
                    } else {
                        if(data.code == '2') {
                            $('#cashformbutton').attr('disabled', true);
                        }
                        alert(data.msg);
                        $('.jqibox').css('display', 'none');
                    }
                }, 'json');
            }
        }
        else
        {
           $.prompt('<h3 style="padding-left:10px;">Error!</h3><p style="padding:10px">Please accept the Terms and Conditions </p>');
        }
}

/*function callbackfunc(v,m,f)
{
    if(v == true)
    {
        $('#loginform').submit();
    }
}*/
