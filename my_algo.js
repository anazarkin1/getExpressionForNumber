/*
    Source used:
        http://www.ai-junkie.com/ga/intro/gat2.html

 */
/* Codes for symbols:
0:         0000
1:         0001
2:         0010
3:         0011
4:         0100
5:         0101
6:         0110
7:         0111
8:         1000
9:         1001
+:         1010
-:          1011
*:          1100
/:          1101

 */

const GENE_SIZE = 4;
const POPULATION_SIZE = 200;
const MAX_GENERATIONS =4000;
const MUTATION_RATE=0.01;
const CROSSOVER_RATE = 0.7;
const CHROMO_LENGTH=100*GENE_SIZE;

//between 0 and 1
function get_random_number (minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function get_random_bits(length){
    out="";
    index=0;
    while(index<length){
        out+=get_random_number(0,1);
        index++;
    }
    return out;
}
function bin_to_dec(bin_value){
    out="";
    switch(bin_value){
        case "0000":
            out="0";
            break;
        case "0001":
            out="1";
            break;
        case "0010":
            out="2";
            break;
        case "0011":
            out="3";
            break;
        case "0100":
            out="4";
            break;
        case "0101":
            out="5";
            break;
        case "0110":
            out="6";
            break;
        case "0111":
            out="7";
            break;
        case "1000":
            out="8";
            break;
        case "1001":
            out="9";
            break;
        case "1010":
            out="+";
            break;
        case "1011":
            out="-";
            break;
        case  "1100":
            out="*";
            break;
        case "1101":
            out="/";
            break;
        default:
            out="";
            break;

    }
    return out;
}
function getDecodeChromo(input){
    var out="";
    var i =0;
    var res="";
    var needOperator=false;
    try{
        while(i<CHROMO_LENGTH){
            this_gene=bin_to_dec(input.slice(i,i+4));
            i+=GENE_SIZE;
            if(this_gene==="")
                continue;
            if(needOperator===true){
                if(this_gene==="+"||this_gene==="-"||this_gene==="/"||this_gene==="*"){
                    out=out+this_gene;
                    needOperator=false;
                }else{
                    continue;
                }
            }else{
                if(this_gene!="+"&&this_gene!="-"&&this_gene!="/"&&this_gene!="*"){
                    out=out+this_gene;
                    needOperator=true;
                }else{
                    continue;
                }
            }

        }
        //last char of out
        var lc=out.substr(out.length-1);
        //If last char is operator, just remove it
        if(lc==="+"||lc==="-"||lc==="/"||lc==="*")
            out=out.slice(0,out.length-1);
       //Change any "/0" into "+0" to avoid division by 0
       res=out;
       for(var j =0 ; j <out.length;j++){
            if(out[j]=='/'&&out[j+1]=='0'){
                res=out.slice(0,j)+"+"+out.slice(j+1,out.length);
            }
       }
}catch(e){
    Console.log(e.description+" on :"+input);
}finally{
    return res;
}

}

function calculateChromoValue(chromo){

    /*Used to evaluate string from left to right without math operations order*/

    // result=parseInt(chromo[0]);
    //     index=1;
    //     while(index<chromo.length-1){
    //         if(chromo[index]==="+"){
    //             result+=parseInt(chromo[index+1]);
    //         }else if(chromo[index]==="-"){
    //             result-=parseInt(chromo[index+1]);
    //         }else if(chromo[index]==="/"){
    //             result/=parseInt(chromo[index+1]);
    //         }else if(chromo[index]==="*"){
    //             result*=parseInt(chromo[index+1]);
    //         }
    //         index+=2;
    //     }
    // return result;

    /**/


    //Evaluate string according to math rules and in math order
    return eval(chromo);


}

function getFitness(value, target){
    result=calculateChromoValue(value);
    if(result===target){
        return 9999;
    }else{
        return 1/Math.abs(target- result);
    }

}


//Return random chromosome from population via roulette method
function roulette(total_fitness, population){
    slice=get_random_number(0,total_fitness);
    fitness_sofar=0;
    for(var i =0; i < POPULATION_SIZE; i++){
        fitness_sofar+=population[i].fitness;
        if(fitness_sofar>=slice){
            return population[i].bits;
        }
    }

    return "";
}

function crossover(offspring1, offspring2){
    position = get_random_number(0,CHROMO_LENGTH);

     t1 = offspring1.slice(0, crossover) + offspring2.slice(crossover, CHROMO_LENGTH);
     t2 = offspring2.slice(0, crossover) + offspring1.slice(crossover, CHROMO_LENGTH);

    offspring1 = t1; offspring2 = t2;

}
function mutate(bits){
    for (i=0; i<bits.length; i++)
    {
        if (get_random_number(0,1)< MUTATION_RATE)
        {
            if (bits[i] == '1'){
                bits[i] = '0';
            }
            else{
                bits.at[i] = '1';
            }
        }
    }

    return;
}

function solve(){
    target=get_random_number(-10,10);
    output_doc=document.getElementById("output");
    closest_chromo="";
    closest_chromo_fitness=0;
    worst_chromo="";
    worst_chromo_fitness=0;
    //Array of populations
    ar_pops=[];
    display("Target: "+target);
    //Populating array with random values and set fitness to 0
    for(i =0; i < POPULATION_SIZE; i++){
        ar_pops[i] = new Population(get_random_bits(CHROMO_LENGTH),0.00);
    }

    var foundTarget=false;
    var iterationCount=0;
    var totalFitness=0;
    while(foundTarget===false && iterationCount<MAX_GENERATIONS){
        /*Trying to display information nicely*/
        // str="Target: "+target+
        // "\nclosest_chromo: "+getDecodeChromo(closest_chromo)+
        // "\nChromoValue: "+calculateChromoValue(getDecodeChromo(closest_chromo))+
        // "\nFitness Rate: "+closest_chromo_fitness+
        // "\nIterations: "+iterationCount;
        // if(iterationCount%10===0)
        //      setTimeout(display(str), 1000);

        totalFitness=0;
        //Get fitness for every population;
        for(i =0; i < POPULATION_SIZE;i++){
            ar_pops[i].fitness=getFitness(getDecodeChromo(ar_pops[i].bits), target);
            totalFitness+=ar_pops[i].fitness;
            // Found our target!
            if(ar_pops[i].fitness===9999){
                output_doc.value=ar_pops[i].bits+" "+getDecodeChromo(ar_pops[i].bits)+"\nTOOK:"+iterationCount;

                foundTarget=true;
                break;
            }

            //Setting new closest values
            if(parseInt(ar_pops[i].fitness)>closest_chromo_fitness){
                closest_chromo=ar_pops[i].bits;
                closest_chromo_fitness=ar_pops[i].fitness;
            }

            if(parseInt(ar_pops[i].fitness)<worst_chromo_fitness){
                worst_chromo=ar_pops[i].bits;
                worst_chromo_fitness=ar_pops[i].fitness;
            }
        }

            nPop=0;
            tempPop=[];
            //Creating new population via roulette/crossover/mutation
            while(nPop<POPULATION_SIZE){
                offspring1 = roulette(totalFitness, ar_pops);
                offspring2 = roulette(totalFitness,ar_pops);
                crossover(offspring1,offspring2);
                mutate(offspring1);
                mutate(offspring2);
                tempPop+=new Population(offspring1, 0.00);
                tempPop+=new Population(offspring2, 0.00);
                nPop+=2;

            }


            //Copy new population
            for(i = 0; i < CHROMO_LENGTH;i++){
                ar_pops[i]=tempPop[i];
            }

        iterationCount++;
    }
   out_str ="Target: "+target+
        "\nClosest chromo: "+getDecodeChromo(closest_chromo)+
        "\nChromo Value: "+calculateChromoValue(getDecodeChromo(closest_chromo))+
        "\nWorst Chromo: "+getDecodeChromo(worst_chromo)+
        "\nWorst Value: "+calculateChromoValue(getDecodeChromo(worst_chromo))+
        "\nFitness Rate: "+closest_chromo_fitness+
        "\nIterations: "+iterationCount;
        display(out_str);

}
function Population(bits, fitness){
    this.bits=bits;
    this.fitness = fitness;
}
function display(str){
    // var c=document.getElementById("canvas");
    // var ctx=c.getContext("2d");
    // ctx.font="15px Arial";

    // text = str.split("\n");
    // for(i=0; i< text.length; i++)
    //     ctx.fillText(text[i],10,20*(i+1));
    out=document.getElementById("output");
    out.value=str;
}