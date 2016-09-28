

var Nav = {
    
    history: {
        
        page: [],
        
        param: []
        
    },
    
    begin: {
        
        page: '',
        
        param: ''
        
    },
    
    currentPage: "",
    
    currentParam: "",
    
    events: {
        
        open: {},
        
        close: {}
        
    },
    
    goTo: function(page, param, flag){
        
        if(this.currentPage == page)
            return false;
        
        if(this.currentPage != "" && this.events.close[this.currentPage] != "undefined")
            this.events.close[this.currentPage](this.currentParam);
        
        if(this.events.open[page] != "undefined")
            this.events.open[page](param);
        
        this.currentPage = page;
        
        this.currentParam = param;
        
        if(flag != true){
        
            this.history.page[this.history.page.length] = page;

            this.history.param[this.history.param.length] = param;
            
        }
        
    },
    
    back: function(){
        
        if(this.history.page.length < 2 || this.history.param.length < 2)
            return false;
        
        if(this.history.param.length != this.history.page.length)
            return false;
        
        var i = this.history.page.length - 2;
        
        delete this.history.page[i + 1];
        
        this.history.page.length -= 1;
        
        this.history.param.length -= 1;
        
        delete this.history.param[i + 1];
        
        this.goTo(this.history.page[i],this.history.param[i],true);
        
    },
    
    init: function(){
        
        this.goTo(this.begin.page,this.begin.param);
        
        $('[data-page]').click(function(){
            
            var page = $(this).attr('data-page');
            
            var param = $(this).attr('data-param');
            
            Nav.goTo(page, param);
            
        });
        
        $('[data-back]').click(function(){
            
            Nav.back();
            
        });
        
        document.addEventListener("backbutton", function(){
            
            Console.log('BACKBUTTON');
            
            Nav.back();
            
        }, true);
        
    },
    
    hiddenAll: function(){
        
        $('section.page').css('display','none');
        
    }
    
}