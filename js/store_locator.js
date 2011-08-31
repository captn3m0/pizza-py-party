//http://www.dominos.co.in/orderonline/js/store_locator.js
$(document).ready(function()
    {   
        $(".cities").change(function()
        {
            var id=$(this).val();
           
            var dataString = 'cityid='+ id+'&type=getLocality';
            $('#blocker').css('display','block');
            $.ajax
            ({
                type: "GET",
                url: "get_locality.php",
                data: dataString,
                cache: false,
                success: function(html)
                {      
                    if(html=="null")
                    {
                       $(".locality").css("display","none");
                       $(".sublocality").css("display","none");  
                       $(".area1").css("display","none");  
                       $(".area2").css("display","none");   
                       $(".StNameFlatNo").css("display","block");  
                       $("#savenewaddress").css("display","block");  
                       $('#blocker').css('display','none'); 
                    }   
                    else
                    {            
                        $(".locality").css("display","block");  
                        $(".sublocality").css("display","none");  
                        $(".area1").css("display","none");  
                        $(".area2").css("display","none");  
                        $(".StNameFlatNo").css("display","none");  
                        $("#savenewaddress").css("display","none");  
                        $(".locality").html(html);
                        $('#blocker').css('display','none');
                    }   
                }
            });      

        });   

    });
    

$(document).ready(function()
    {
        $(".locality").change(function()
        {                                
            var loclaityid = $('.locality option:selected').val();  
            var cityid = $('.cities option:selected').val();  
            var dataString = 'cityid='+cityid+'&localityid='+loclaityid+'&type=getSubLocality';
            $('#blocker').css('display','block'); 
            $.ajax
            ({
                type: "GET",
                url: "get_locality.php",
                data: dataString,
                cache: false,
                success: function(html)
                {                
                    if(html=="null")
                    {
                        
                       $(".sublocality").css("display","none");
                       $(".area1").css("display","none");
                       $(".area2").css("display","none");   
                       $(".StNameFlatNo").css({"display":"block","clear":"both"});  
                       $("#savenewaddress").css("display","block");  
                       $('#blocker').css('display','none');      
                    }
                    else
                    {  
                        $(".sublocality").css("display","block");     
                        $(".area1").css("display","none");  
                        $(".area2").css("display","none");  
                        $(".StNameFlatNo").css("display","none");  
                        $("#savenewaddress").css("display","none");  
                        $(".sublocality").html(html); 
                        $('#blocker').css('display','none'); 
                    }
                    
                }
            });   

        });  
    
    });
    
    
$(document).ready(function()
    {
        $(".sublocality").change(function()
        {                                
            var sublocalityid = $('.sublocality option:selected').val(); 
            var loclaityid = $('.locality option:selected').val();  
            var cityid = $('.cities option:selected').val();
            
            var dataString = 'cityid='+cityid+'&localityid='+loclaityid+'&sublocalityid='+ sublocalityid+'&type=getArea1';
            
            $('#blocker').css('display','block');
            $.ajax
            ({
                type: "GET",
                url: "get_locality.php",
                data: dataString,
                cache: false,
                success: function(html)
                {                       
                    if(html=="null")
                    {
                      $(".area1").css("display","none");  
                      $(".StNameFlatNo").css({"display":"block","clear":"both"}); 
                      $("#savenewaddress").css("display","block");  
                      $('#blocker').css('display','none'); 
                    }
                    
                    else if (sublocalityid == 0)
                    {
                        $(".area1").css("display","block"); 
                        $(".area2").css("display","none");  
                        $(".StNameFlatNo").css("display","none"); 
                        $("#savenewaddress").css("display","none");  
                        $(".area1").html(html);
                        $('#blocker').css('display','none');
                        //$html('<div class="clr"></div>') ;
                          
                    }
                    else
                    {  
                        $(".area1").css("display","block"); 
                        $(".area2").css("display","none");  
                        $(".StNameFlatNo").css("display","none"); 
                        $("#savenewaddress").css("display","none");  
                        $(".area1").html(html);
                        $('#blocker').css('display','none'); 
                        //$html('<div class="clr"></div>') ;
                           
                    }
                    
                }
            }); 

        });  
    
    });
    
$(document).ready(function()
    {
        $(".area1").change(function()
        {                                
            var id = $('.area1 option:selected').val(); 
            
            var sublocalityid = $('.sublocality option:selected').val(); 
            var loclaityid = $('.locality option:selected').val();  
            var cityid = $('.cities option:selected').val();
            
            
            var dataString ='cityid='+cityid+'&localityid='+loclaityid+'&sublocalityid='+ sublocalityid+'&area1id='+ id+'&type=getArea2';
            $('#blocker').css('display','block'); 
            $.ajax
            ({
                type: "GET",
                url: "get_locality.php",
                data: dataString,
                cache: false,
                success: function(html)
                {                       
                    if(html=="null")
                    {
                       
                       $(".area2").css("display","none");  
                       $(".StNameFlatNo").css({"display":"block","clear":"both"});  
                       $("#savenewaddress").css("display","block");  
                       $('#blocker').css('display','none'); 
                    }
                    else
                    {                
                        $(".area2").css("display","block");  
                        $(".area2").css("display","none");  
                        $(".StNameFlatNo").css("display","none");
                        $("#savenewaddress").css("display","none");  
                        $(".area2").html(html);    
                        $('#blocker').css('display','none'); 
                    }
                    
                }
            }); 

        });  
    
    });
