function init() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      let sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(selection) {
    // Fetch new data each time a new sample is selected
    buildMetadata(selection);
    buildCharts(selection);
    
  }
  
  // Demographics demoInfo 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      let metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];

      let demoInfo = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      demoInfo.html("");
  
      // Use `Object.entries` to add each key and value pair to the demoInfo
      Object.entries(result).forEach(([key, value]) => {
        demoInfo.append("h6").text(`${key}: ${value}`);
      });
  
    });
  }
  
  // Create the buildCharts function.
  function buildCharts(sample) {
    //Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      //Create a letiable that holds the samples array. 
      console.log(data);
      let samplesArray = data.samples;
      console.log(samplesArray);
      //Create a letiable that filters the samples for the object with the desired sample number.
      let selectedIdSamples = samplesArray.filter(data => data.id == sample);
      console.log(selectedIdSamples);
      //Create a letiable that holds the first sample in the array.
      let firstSample = selectedIdSamples[0];
      console.log(firstSample);
  
      //Create letiables that hold the otu_ids, otu_labels, and sample_values.
      let otuIds = firstSample.otu_ids;
      let otuLabels = firstSample.otu_labels;
      let sampleValues = firstSample.sample_values;
      // console.log(otuIds);
      // console.log(otuLabels);
      // console.log(sampleValues);
  
      //Create the yticks for the bar chart.
  
      let yticks = otuIds.slice(0,10).map(id => "OTU " + id).reverse();
      console.log(yticks);
      
      //Create the trace for the bar chart. 
      let barData = [{
        x: sampleValues.slice(0,10).reverse(),
        text: otuLabels.slice(0,10).reverse(),
        type: "bar"
      }];
      //Create the layout for the bar chart. 
      let barLayout = {
        yaxis: {
          tickmode: "array",
          tickvals: [0,1,2,3,4,5,6,7,8,9],
          ticktext: yticks
        },
        annotations: [{
          xref: 'paper',
          yref: 'paper',
          x: 0.5,
          xanchor: 'center',
          y: -0.25,
          yanchor: 'center',
          showarrow: false
        }]
      };
      //console.log("hello");
      //Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout, {responsive: true});
  
      // Bar and Bubble charts
      // Create the buildCharts function.

  
      //Create the trace for the bubble chart.
      let bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Rainbow"
        }
      }];
      console.log(bubbleData);
      //Create the layout for the bubble chart.
      let bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        showlegend: false,
        xaxis: {title: "OTU ID", automargin: true},
        yaxis: {automargin: true},
        hovermode: "closest"
      };
      console.log(bubbleLayout);
  
      //Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});
  
      //Create a letiable that filters the metadata array for the object with the desired sample number.
      let metadata_SelId = data.metadata.filter(data => data.id == sample);
      console.log(metadata_SelId);  
  
      //Create a letiable that holds the washing frequency.
      let washFreq = +metadata_SelId[0].wfreq;
      
      //Create the trace for the gauge chart.
      let gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washFreq,
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {
              range: [null, 10],
              tickmode: "array",
              tickvals: [0,2,4,6,8,10],
              ticktext: [0,2,4,6,8,10]
            },
            bar: {color: "black"},
            steps: [
              { range: [0, 2], color: "purple" },
              { range: [2, 4], color: "blue" },
              { range: [4, 6], color: "green" },
              { range: [6, 8], color: "orange" },
              { range: [8, 10], color: "red" }]
          }
        }
      ];
      
      // Create the layout for the gauge chart.
      let gaugeLayout = { 
        autosize: true,
        annotations: [{
          xref: 'paper',
          yref: 'paper',
          x: 0.5,
          xanchor: 'center',
          y: 0,
          yanchor: 'center',
          text: "Belly button washing frequency",
          showarrow: false
        }]
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
    });
  }