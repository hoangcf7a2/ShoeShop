function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        console.log(key)
        if (!map.has(key)) {
            map.set(key, [item]);
        } else {
            map.get(key).push(item);
        }
    });
    return map;
}

const pets = [
    {type:"Dog", age: 3, name:"Spot"},
    {type:"Cat", age: 3, name:"Tiger"},
    {type:"Dog", age: 4, name:"Rover"}, 
    {type:"Cat", age: 3, name:"Leo"}
];

const grouped = groupBy(pets,
pet => JSON.stringify({ type: pet.type, age: pet.age }));

console.log(grouped.get('{"type":"Dog","age":3}'));


var as2D = [ 
    ["a","b","c","d","e","f","g","h","i","j"], 
    ["A","B","C","D","E","F","G","H","I","J"], 
    ["!","@","#","$","%","^","&","*","(",")"] 
    ];
console.log(as2D)