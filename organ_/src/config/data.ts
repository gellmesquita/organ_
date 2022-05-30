var data = new Date();
var dia = String(data.getDate()).padStart(2,'0')
var mes = String(data.getMonth() + 1).padStart(2,'0')
var ano = String(data.getFullYear()).padStart(2,'0')

var dataAtual = ano +'-'+mes+'-'+ dia
var dias =10

function addDias(data:any, dias:any) {
    var res = new Date(data);
    res.setDate(res.getDate() + 1 + dias);
    return res
}
var tmpDate = new Date(dataAtual)
var t =(addDias(tmpDate, dias));
var b= t.toISOString();
var inicio = b.split("T")

var c = (inicio[0]);

console.log(c)



export {addDias, c}




