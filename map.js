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