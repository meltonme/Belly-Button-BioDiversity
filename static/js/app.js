// Use the d3 library to read the sample.json from the url
const url= "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

const data = d3.json(url);
console.log("Data ", data);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log("data is", data)
})

// To select the new sample
var sampleSelector = d3.select("#selDataset")
console.log("sampleSelector is",sampleSelector)

function init() {
    d3.json(url).then(function(data) {
        // To get the sample names
        let sampleName = data.names
        console.log("sampleSelector is",sampleSelector)
        // let sampleData = data.samples
        console.log("sample names are", sampleName)
        // Inserts the selected sample id 
        for(let i=0;i<sampleName.length;i++){
          var sampleId = sampleName[i]
          sampleSelector.append("option").text(sampleId).property("value",sampleId)};
    
        barChart(sampleName[0]);
        bubbleChart(sampleName[0]);
        sampleMetadata(sampleName[0]);
            })}
          
    init();
    //  Horizontal Bar chart with the top 10 samples
    function barChart(sampleId){
      d3.json(url).then(function(data) {
      // To get the samples data and store it in the array
          let sampleData = data.samples;
          console.log("sampledata is:",sampleData)
// Arrow function is used to filter and get the sample values, out_ids and otu_labels for that filtered sample id
          let filteredValue = sampleData.filter(sample => sample.id == sampleId)
          let sampleValData = filteredValue[0]
          console.log("filtered value",filteredValue)
          console.log("samplevalue",sampleValData)
          let x_sampleValues = sampleValData.sample_values;
          let y_otuIds= sampleValData.otu_ids;
          let otuLabels = sampleValData.otu_labels;

      // To display the top 10 OTUs based on the sample values
         let x_sampleSlice =x_sampleValues.slice(0, 10).reverse();
         let y_otuIdsSlice = y_otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();
         let otuLabelsSlice = otuLabels.slice(0, 10).reverse();
         console.log(x_sampleSlice);
         console.log(y_otuIdsSlice);
         console.log(otuLabelsSlice);
      // Trace1 for the Data
         let trace1 = {
         x: x_sampleSlice,
         y: y_otuIdsSlice,
         text: otuLabelsSlice,
          name: "Belly-Button",
          type: "bar",
          orientation: "h"
       };
  
  // Data array
         let dataTrace = [trace1];
  // Apply a title to the layout
         let layout = {
            margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 100 }
          
      }
      Plotly.newPlot("bar", dataTrace, layout);
  })};
  barChart();

  function bubbleChart(sampleId){
      d3.json(url).then(function(data) {
          // To get the samples and store it in sampleData array
         let sampleData = data.samples 

// Arrow function is used to filter and get the sample values, out_ids and otu_labels for that filtered sample id
      
         let filteredValue = sampleData.filter(sample => sample.id == sampleId)
         let sampleValData = filteredValue[0]
         console.log("filtered value",filteredValue)
         console.log("samplevalue",sampleValData)
         let sample_values = sampleValData.sample_values;
         let otu_ids= sampleValData.otu_ids;
         let otu_labels = sampleValData.otu_labels;
      //    To plot the bubble chart
         let trace2 = {
          x:otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker:{
           color : otu_ids,
           size : sample_values,
           colorscale: 'Earth'
         }
  };
  
  // Data array
      let dataTrace2 = [trace2];
  // Apply a title to the layout
      let layout2 = {
              title:"Bubble Chart for each ID Based on Sample Size",
              // showlegend: false,
              height: 800,
              width: 800
            };
     
      Plotly.newPlot("bubble", dataTrace2, layout2);
    
      
  })};
  bubbleChart();
  
  
  function sampleMetadata(sampleId){
      d3.json(url).then(function(data) {
          console.log("sample id is:", sampleId)
          let MetadataSample = d3.select("#sample-metadata").html("")
          let metaData = data.metadata;
          let M_filteredValue = metaData.filter(sample => sample.id == sampleId)[0]
          // let M_sampleValData = M_filteredValue[0]
          console.log("Meta filtered value",M_filteredValue)
          Object.entries(M_filteredValue ).forEach(([key, value]) => {
                  MetadataSample.append("h6").text(`${key}: ${value}`)});
        
      
  })};
 
  sampleMetadata();