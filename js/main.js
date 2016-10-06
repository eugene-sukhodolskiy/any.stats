var graph = {};

$(document).ready(function(){
    
    DB.open("Test5","0.1",9000000);
    DB.createTables(tables);
    
    Nav.begin.page = 'groups';
    
    Nav.begin.param = 'group list';
    
    Nav.init();
    
    Funcs.init();
    
    inpFocus();
    
    graph = getGraph({"canvas": 'main-canvas',"size": 10});
    
    $('#showStats select[name="period"]').change(function(){
        
        Nav.reload();
        
    });
    
    $('.form-wrap.input input[type="text"]').blur(function(){
        
        hiddenInput(this);
        
    });
    
    $('input[data-len-max]').keydown(function(e){
        
        var char = e.keyCode;
        
        if(char == 13){
            
            $(this).blur();
            
            return false;
            
        }
        
        var counter = $(this).parent().find('span.counter');
        
        var max = parseInt($(this).attr("data-len-max"));
        
        var val = $(this).prop('value');
        
        var count = parseInt($(counter).attr('data-count'));
        
        count = (isNaN(count)) ? 0 : count;
        
        $(this).attr('value',$(this).prop('value'));
        
        if(count >= max && char != 8 && char != 13){
            
            console.log(char);
            
            return false;

        }
        
        if(count == 0 && char == 8)
            return false;
        
        if(count > 0 && char == 8)
            count--;
        else if(char != 13 && char != 39 && char != 37 && char != 35 && char != 36) 
            count++;
        
        var len = count;
        
        len = (len > max) ? max : len;
        
        len = max - len;
        
        $(counter).html(len + '/' + max).attr('data-count',count);
        
        if(len <= 5){
            
            $(counter).css({'opacity': 1});
            
        } else {
            
            $(counter).css({'opacity': 0});
            
        }
        
        
    });
    
});
