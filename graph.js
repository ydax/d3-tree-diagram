// setup the dimensions of the tree diagram
const dims = { height: 500, width: 1100 };

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 100)
    .attr('height', dims.height + 100);

const graph = svg.append('g')
    .attr('transform', 'translate(50, 50)');

// setup a data stratification function 
const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent);

// fcn for turning stratified data into a tree diagram
const tree = d3.tree()
    .size([dims.width, dims.height]);

// update function
const update = (data) => {
    // remove current nodes
    graph.selectAll('.node').remove();
    graph.selectAll('.link').remove();
    
    // store data in stratified format in rootNode
    const rootNode = stratify(data);
    
    // pass stratified data into the d3 tree fcn
    const treeData = tree(rootNode);
    
    // append anything with a class of node to the graph
    const nodes = graph.selectAll('.node')
        // chain the descendants method on so that the treeData returns in array format (needed by d3)
        .data(treeData.descendants());
        // ^-- join data to anything with the class "node"
    
    // get link selection and join data
    const links = graph.selectAll('.link')
        .data(treeData.links());
    //                   ^-- dynamically generate paths between nodes

    links.enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#666666')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );
    
    // create enter node groups
    const enterNodes = nodes.enter()
        //                        ^-- get the enter selection from nodes
        .append('g')
        //    ^-- append a group to each enter selection
            .attr('class', 'node')
        //               ^-- give each group the class "node"
            .attr('transform', d => `translate(${ d.x }, ${ d.y })`);
    
    // append rects to enter nodes
    enterNodes.append('rect')
        .attr('fill', '#000099')
        .attr('stroke', '#ff3366')
        .attr('stroke-width', 2)
        .attr('height', 50)
        .attr('width', d => { d.data.name.length * 20 })
        //           ^-- dynamically generate width based on length of name
        .attr('transform', d => {
            let xShift = d.data.name.length * 10;
            return `translate(${-xShift}, -25)`;
        });
    
    // append text to the rectangles
    enterNodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffff33')
        .text(d => d.data.name);
}

var data = [];

// grab the database and the employees collection
// onSnapshot alerts when any change is made
db.collection('employees').onSnapshot(res => {

    // loop through each change (incl. on page load)
    res.docChanges().forEach(change => {

        // setup a doc for each change that I'll ultimately store in the data array above, incl. the id
        const doc = { ...change.doc.data(), id: change.doc.id };

        // find out what kind of change was made, then switch the logic accordingly
        switch (change.type) {
            case 'added':
                data.push(doc);
                break;

            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;

            case 'removed':
                data.filter(item => item.id !== doc.id);
                break;
            
            default:
                break;
            
        }
    });

    update(data);

});