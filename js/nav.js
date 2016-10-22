

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
    
    tmpBack: false,
    
    addTmpBack: function(func){
        
        this.tmpBack = func;
        
    },
    
    removeTmpBack: function(){
        
        this.tmpBack = false;
        
    },
    
    preBack: function(){
        
        if(typeof Nav.tmpBack == 'function'){

            Nav.tmpBack();

            Nav.removeTmpBack();

            return false;

        }
        
        return true;
        
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
        
        console.log('Nav.goTo('+page+')');
        
        return true;
        
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
        
        console.log('Nav.back()');
        
        return true;
        
    },
    
    initPages: function(container){
        
        container = container || "";
        
        $(container + ' [data-page]').click(function(){
            
            if($(this).attr('data-taphold') == 1){

                $(this).removeAttr('data-taphold');

                return false;

            }

            var page = $(this).attr('data-page');

            var param = $(this).attr('data-param');
            
            Nav.goTo(page, param);

        });
        
        console.log('Nav.initPages()');
        
    },
    
    initBackbtn: function(){
        
        $('[data-back]').click(function(){
            
            if(Nav.preBack())
                Nav.back();

        });

        document.addEventListener("backbutton", function(){
            
            if(Nav.preBack()){

                if(Nav.back() == false){

                    navigator.app.exitApp();

                }
                
            }

        }, true);
        
        console.log('Nav.initBackbtn()');
        
    },
    
    init: function(){
        
        if(this.currentPage == "")
            this.goTo(this.begin.page,this.begin.param);
        
        this.initPages();
        
        this.initBackbtn();
        
        console.log('Nav.init()');
        
    },
    
    hiddenAll: function(){
        
        console.log('Nav.hiddenAll()');
        
        $('section.page').css('display','none');
        
    },
    
    reload: function(){
        
        console.log('Nav.reload()');
        
        if(this.currentPage != "" && this.events.close[this.currentPage] != "undefined")
            this.events.close[this.currentPage](this.currentParam);

        if(this.events.open[this.currentPage] != "undefined")
            this.events.open[this.currentPage](this.currentParam);
        
    }
    
}