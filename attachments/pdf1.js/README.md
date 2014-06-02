Have PDFs in a PouchDB database? You can view them using this web app by setting the db, docId, and file parameters in the viewer.html's URL.  

For example...

http://.../viewer.html?db=testfiles&docId=helloworld&file=helloworld.pdf

![hello world pdf](screenshot.png)

Warning: This only seems to be working in Firefox at the moment.

Based on the [PDF Viewer in the PDF.js project](http://mozilla.github.io/pdf.js/) as well as [this gist](https://gist.github.com/rjsteinert/6092002). 

