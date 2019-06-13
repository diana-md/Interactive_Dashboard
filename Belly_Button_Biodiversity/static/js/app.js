function buildMetadata(sample) {
  //  Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/" + sample).then(function (s_meta) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var block = d3.select("#sample-metadata");
    html_code = "";
    html_code += `<p>AGE : ${s_meta.AGE} </p>`;
    html_code += `<p>BBTYPE : ${s_meta.BBTYPE} </p>`;
    html_code += `<p>ETHNICITY : ${s_meta.ETHNICITY} </p>`;
    html_code += `<p>GENDER : ${s_meta.GENDER} </p>`;
    html_code += `<p>LOCATION : ${s_meta.LOCATION} </p>`;
    html_code += `<p>SAMPLEID : ${s_meta.sample} </p>`;
    block.html(html_code);
  })
}

function buildCharts(sample) {
  // Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then(function (s_data) {
    // Build a Bubble Chart using the sample data
    var x_val = s_data["otu_ids"];
    var y_val = s_data.sample_values;
    var marker_size = s_data.sample_values;
    var text = s_data.out_labels;
    var trace1 = { x: x_val, y: y_val, mode: 'markers', marker: { color: x_val, size: marker_size } };
    var data = [trace1];
    var layout = { showlegend: true, height: 700 }
    Plotly.plot("bubble", data, layout);

    // Build a Pie Chart
    var top10vals = s_data.sample_values.slice(0, 10);
    var top10ids = s_data.otu_ids.slice(0, 10);
    var top10labels = s_data.otu_labels.slice(0, 10);
    var data = [{
      values: top10vals,
      labels: top10ids,
      hovertext: top10labels,
      hoverinfo: 'hovertext',
      type: "pie"
    }];
    var layout = { height: 600, width: 800 }
    Plotly.plot("pie", data, layout);
  })
}

function updateCharts(newSample) {
  d3.json("/samples/" + newSample).then(function (s_data) {
    //Update the Bubble Chart
    var BUBBLE = document.getElementById("bubble");
    Plotly.restyle(BUBBLE, "x", [s_data["otu_ids"]]);
    Plotly.restyle(BUBBLE, "y", [s_data.sample_values]);
    marker_dic = { "color": s_data["otu_ids"], size: s_data.sample_values };
    Plotly.restyle(BUBBLE, "marker", [marker_dic]);
    //Update the PIE Chart
    PIE = document.getElementById("pie");
    Plotly.restyle(PIE, "values", [s_data.sample_values.slice(0, 10)]);
    Plotly.restyle(PIE, "labels", [s_data.otu_ids.slice(0, 10)]);
    Plotly.restyle(PIE, "hovertext", [s_data.otu_labels.slice(0, 10)]);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  updateCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
