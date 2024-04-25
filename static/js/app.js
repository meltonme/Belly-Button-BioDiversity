// Use the d3 library to read the sample.json from the url
const url= "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the JSON data and call the init function
d3.json(url).then(function(data) {
    init(data);
}).catch(function(error) {
    console.log("Error fetching data:", error);
});

function init(data) {
    // To select the new sample
    var sampleSelector = d3.select("#selDataset");
    
    // Get the sample names
    let sampleName = data.names;
    // Inserts the selected sample id 
    sampleName.forEach(sampleId => {
        sampleSelector.append("option").text(sampleId).property("value", sampleId);
    });
    
    // Initialize with the first sample
    const initialSampleId = sampleName[0];
    barChart(data, initialSampleId);
    bubbleChart(data, initialSampleId);
    sampleMetadata(data, initialSampleId);
}

//  Horizontal Bar chart with the top 10 samples
function barChart(data, sampleId) {
    let sampleData = data.samples;
    // Filter sample data
    let filteredValue = sampleData.find(sample => sample.id === sampleId);
    let x_sampleValues = filteredValue.sample_values.slice(0, 10).reverse();
    let y_otuIdsSlice = filteredValue.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let otuLabelsSlice = filteredValue.otu_labels.slice(0, 10).reverse();

    let trace1 = {
        x: x_sampleValues,
        y: y_otuIdsSlice,
        text: otuLabelsSlice,
        name: "Belly-Button",
        type: "bar",
        orientation: "h"
    };

    let layout = {
        margin: { l: 100, r: 100, t: 100, b: 100 }
    };

    Plotly.newPlot("bar", [trace1], layout);
}

function bubbleChart(data, sampleId) {
    let sampleData = data.samples;
    let filteredValue = sampleData.find(sample => sample.id === sampleId);

    let trace2 = {
        x: filteredValue.otu_ids,
        y: filteredValue.sample_values,
        text: filteredValue.otu_labels,
        mode: 'markers',
        marker: {
            color: filteredValue.otu_ids,
            size: filteredValue.sample_values,
            colorscale: 'Earth'
        }
    };

    let layout2 = {
        title: "Bubble Chart for each ID Based on Sample Size",
        height: 800,
        width: 800
    };

    Plotly.newPlot("bubble", [trace2], layout2);
}

function updateChartsAndMetadata() {
  // Get the selected sample ID
  let selectedSample = d3.select("#selDataset").property("value");

  // Call the function to update charts and metadata
  barChart(data, selectedSample);
  bubbleChart(data, selectedSample);
  sampleMetadata(data, selectedSample);
}


function sampleMetadata(data, sampleId) {
  let MetadataSample = d3.select("#sample-metadata").html("");
  let metaData = data.metadata;
  let M_filteredValue = metaData.find(sample => sample.id === parseInt(sampleId));

  // Display metadata
  Object.entries(M_filteredValue).forEach(([key, value]) => {
      MetadataSample.append("h6").text(`${key}: ${value}`);
  });
}




// Event listener for sample selection
d3.select("#selDataset").on("change", function() {
  let selectedSample = d3.select(this).property("value");
  updateChartsAndMetadata(data, selectedSample);
});

