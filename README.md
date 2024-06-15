# passwhash
A new hashing method for <b>passwords</b>.<br/>

Use it in JavaScript:<br/>
```js
        var c = require('./enc.js');
        console.log(c.passwhash('Hello', 'with secret!'));
```
<br/>

Or in Python:<br/>
```python
        import enc as c
        print(c.passwhash("Hello", "with secret!"))
```
<br/>

# Warning
As this algorithm is still in development, use with caution.

# Notice
```
This software comes with ABSOLUTELY NO WARRANTY.
I AM NOT LIABLE FOR ANY DAMAGE CAUSED BY THIS SOFTWARE.
```