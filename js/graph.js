function getGraph(param){

    param.size = param.size || 20;

    var ret = {

        canvas: param.canvas,

        data: [],

        sizeY: param.size,
        
        sizeX: 80,

        colors: ['red','blue','green','grey','orange','black'],

        set: function(content){

            this.data = content;

        },
        
        clear: function(){
            
            var height = parseInt($('#'+this.canvas).attr('height'));
            
            var width = parseInt($('#'+this.canvas).attr('width'));
            
            ctx = document.getElementById(this.canvas);
            
            ctx = ctx.getContext('2d');
            
            ctx.fillStyle = 'white';
            
            ctx.fillRect(0,0,width,height);
             
            
        },

        draw: function(){

            var ctx = [];

            for(var n=0;n<this.data.length;n++){

                ctx[n] = document.getElementById(this.canvas);

                var height = parseInt($('#'+this.canvas).attr('height'));

                ctx[n] = ctx[n].getContext('2d');

                ctx[n].strokeStyle = this.colors[n];

                ctx[n].fillStyle = this.colors[n];

                ctx[n].beginPath();

                for(var i=0;i<this.data[n].length;i++){

                    var x = parseInt(this.data[n][i][0] * this.sizeX);

                    var y = parseInt(this.data[n][i][1] * this.sizeY + 20);

                    y = height - y;

//                    console.log(x+':'+y);

                    if(i)
                        ctx[n].lineTo(x,y);
                    else
                        ctx[n].moveTo(x,y);

                    ctx[n].fillRect(x-3,y-3,6,6);
                    ctx[n].fillText(this.data[n][i][1], x - 6, y - 10);

                }

                ctx[n].stroke();

            }

        }

    }

    return ret;

}











