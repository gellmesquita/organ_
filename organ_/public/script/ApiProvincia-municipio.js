

function populate(s1,s2){
    var s1 = document.getElementById(s1);
    var s2 = document.getElementById(s2);

    s2.innerHTML = "";
    if(s1.value == 'luanda'){
             var optionArray = ['Belas|Belas', 'Cacuaco|Cacuaco', 'Cazenga|Cazenga', 'Icolo e bengo|Icolo e Bengo', 'Quilamba quiaxi|Quilamba Quiaxi', 'Quissama|Quissama', 'Talatona|Talatona', 'Viana|Viana'];
            }else if(s1.value == 'benguela'){
             var optionArray = ['balombo|Balombo', 'Baía|Baía', 'farta|Farta', 'bocoio|Bocoio', 'caimbambo|Caimbambo', 'catumbela|Catumbela', 'chongorói|Chongorói', 'cubal|Cubal', 'ganda|Ganda', 'lobito|Lobito'];
          } else if(s1.value == 'bengo'){
             var optionArray = ['ambriz|Ambriz', 'bula atumba|Bula Atumba','dande|Dande', 'dembos|Dembos', 'nambuangongo|Nambuangongo', 'cango aluquém|Pango Aluquém'];
          }  else if(s1.value == 'bié'){
                       var optionArray = ['andulo|Andulo', 'camacupa|Camacupa','catabola|Catabola', 'chinguar|Chinguar', 'chitembo|Chitembo', 'cuemba|Cuemba', 'cunhinga|Cunhinga', 'nharea|Nharea'];
          } else if(s1.value == 'cabinda'){
                       var optionArray = ['belize|Belize', 'buco-zau|Buco-Zau','cacongo|Cacongo'];
          } else if(s1.value == 'lunda sul'){
                       var optionArray = ['cacolo|Cacolo', 'dala|Dala','muconda|Muconda'];
          } else if(s1.value == 'lunda norte'){
                       var optionArray = ['cambulo|Cambulo', 'capenda-camulemba|Capenda-Camulemba','caungula|Caungula', 'chitato|Chitato', 'cuango|Cuango', 'cuílo|Cuílo', 'lóvua|Lóvua', 'lubalo|Lubalo', 'lucapa|Lucapa', 'xá-muteba|Xá-Muteba'];
          }  else if(s1.value == 'namibe'){
                       var optionArray = ['bibala|Bibala', 'camucuio|Camucuio','tômbua|Tômbua', 'virei|Virei'];
          }  else if(s1.value == 'zaire'){
                       var optionArray = ['cuimba|Cuimba', 'nóqui|Nóqui','nezeto|Nezeto', 'soio|Soio', 'tomboco|Tomboco'];
          }  else if(s1.value == 'cunene'){
                       var optionArray = ['cahama|Cahama', 'cuanhama|Cuanhama','curoca|Curoca', 'cuvelai|Cuvelai', 'namacunde|Namacunde', 'ombadja|Ombadja'];
          } else if(s1.value == 'moxico'){
                       var optionArray = ['alto zambeze|Alto Zambeze', 'bundas|Bundas','camanongue|Camanongue', 'léua|Léua', 'luacano|Luacano', 'luchazes|Luchazes', 'Cameia|Cameia', 'moxico|Moxico'];
          } else if(s1.value == 'cuando-cubango'){
                       var optionArray = ['calai|Calai', 'cuangar|Cuangar','cuchi|Cuchi', 'cuito cuanavale|Cuito Cuanavale', 'dirico|Dirico', 'mavinga|Mavinga', 'nancova|Nancova', 'rivungo|Rivungo'];
          } else if(s1.value == 'cuanza norte'){
                       var optionArray = ['ambaca|Ambaca', 'banga|Banga','bolongongo|Bolongongo', 'cambambe|Cambambe', 'cazengo|Cazengo', 'golungo alto|Golungo Alto', 'gonguembo|Gonguembo', 'lucala|Lucala', 'quiculungo|Quiculungo', 'samba caju|Samba Caju'];
          } else if(s1.value == 'cuanza sul'){
                       var optionArray = ['amboim|Amboim', 'cassongue|Cassongue','cela|Cela', 'conda|Conda', 'ebo|Ebo', 'libolo|Libolo', 'mussende|Mussende', 'porto amboim|Porto Amboim', 'quibala|Quibala', 'quilenda|Quilenda', 'seles|Seles'];
          } else if(s1.value == 'huíla'){
                       var optionArray = ['caconda|Caconda', 'cacula|Cacula','caluquembe|Caluquembe', 'chiange|Chiange', 'chibia|Chibia', 'chicomba|Chicomba', 'chipindo|Chipindo', 'cuvango|Cuvango', 'humpata|Humpata', 'jamba|Jamba', 'matala|Matala', 'quilengues|Quilengues', 'quipungo|Quipungo'];
          } else if(s1.value == 'huambo'){
                       var optionArray = ['bailundo|Bailundo', 'cachiungo|Cachiungo','caála|Caála', 'ecunha|Ecunha', 'londuimbali|Londuimbali', 'longonjo|Longonjo', 'mungo|Mungo', 'chicala choloanga|Chicala Choloanga', 'chinjenje|Chinjenje', 'ucuma|Ucuma'];
          }  else if(s1.value == 'uíge'){
                       var optionArray = ['alto cauale|Alto Cauale', 'ambuíla|Ambuíla','bembe|Bembe', 'buengas|Buengas', 'bungo|Bungo', 'damba|Damba', 'milunga|Milunga', 'mucaba|Mucaba', 'negage|Negage', 'puri|Puri', 'quimbele|Quimbele', 'quitexe|Quitexe', 'sanza|Sanza', 'pombo|Pombo', 'songo|Songo', 'zombo|Zombo'];
          }  else if(s1.value == 'malange'){
                       var optionArray = ['cacuso|Cacuso', 'calandula|Calandula','cambundi-catembo|Cambundi-Catembo', 'cangandala|Cangandala', 'caombo|Caombo', 'cuaba nzoji|Cuaba Nzoji', 'cunda-dia-baze|Cunda-Dia-Baze', 'luquembo|Luquembo', 'marimba|Marimba', 'massango|Massango', 'mucari|Mucari', 'quela|Quela', 'quirima|Quirima'];
          } 

for(var option in optionArray){
var pair = optionArray[option].split("|");
var newoption = document.createElement("option");

newoption.value = pair[0];
newoption.innerHTML=pair[1];
s2.options.add(newoption);
}
}


