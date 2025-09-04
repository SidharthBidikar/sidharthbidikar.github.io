function convertPDF() {
  const pdfFile = document.getElementById("pdfFile").files[0];
  if (pdfFile) {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const typedarray = new Uint8Array(this.result);
      pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
        let fullText = "";
        const totalPages = pdf.numPages;
        const promises = [];
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          promises.push(
            pdf.getPage(pageNum).then(function (page) {
              return page.getTextContent().then(function (textContent) {
                const textItems = textContent.items.map((item) => item.str);
                fullText += textItems.join(",") + "\n";
              });
            })
          );
        }
        Promise.all(promises).then(() => {
          document.getElementById("csvContent").innerText = fullText;
          downloadCSV(fullText);
        });
      });
    };
    fileReader.readAsArrayBuffer(pdfFile);
  } else {
    alert("Please select a PDF file.");
  }
}

function downloadCSV(csvContent) {
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "converted.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
