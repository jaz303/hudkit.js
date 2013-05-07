;(function() {
  
  var hk = modulo.get('hk');
  
  var DEFAULT_PROMPT = {text: '>'},
      HISTORY_LENGTH = 500;
  
  var superKlass = hk.Widget.prototype;
  
  hk.Console = hk.Widget.extend(function() {
    
    hk.Widget.apply(this, arguments);
    
    this._formatter = null;
    
    this._history = [];
    this._historyIx = null;
    
    this.echoOn();
    this.notReady();
    
  }, {
    methods: {
      
      print: function(text, className) { this._appendOutputText(text, className); },
      printError: function(text) { this._appendOutputText(text, 'error'); },
      printSuccess: function(text) { this._appendOutputText(text, 'success'); },
      
      printHTML: function(html) {
        var ele = document.createElement('div');
        if (hk.isDOMNode(html)) {
          ele.appendChild(html);
        } else {
          ele.innerHTML = html;
        }
        this._appendOutputElement(ele);
      },
      
      printObject: function(obj) {
        this.printHTML(this._formatter(obj));
      },
      
      setObjectFormatter: function(formatter) { this._formatter = formatter; },
      
      /**
       * Set the evaluator function.
       * The evaluator function will be passed 2 arguments - the command to be
       * evaluated, and the terminal object.
       *
       * @param evaluator
       */
      setEvaluator: function(evaluator) { this._evaluator = evaluator; },
      
      /**
       * Prompt can either be:
       * a string representing the prompt text
       * an object with any/all of the keys: text, color, className
       * a function returning any of the above
       *
       * @param prompt
       */
      setPrompt: function(prompt) {
        if (typeof prompt == 'string')
          prompt = {text: prompt};
          
        this._userPrompt = prompt;
      },
      
      echoOn: function() { this.setEcho(true); },
      echoOff: function() { this.setEcho(false); },
      setEcho: function(echo) { this._echo = !!echo; },
      
      // terminal is not ready for input; command line is hidden.
      notReady: function() { this._input.style.display = 'none'; },
      
      // terminal is ready for input; command line is shown.
      ready: function() { this._input.style.display = '-webkit-box'; },
      
      /**
       * Clear's the user's current command.
       * Also cancels any active history navigation.
       */
      clearCommand: function() {
        this._command.value = '';
        this._historyIx = null;
      },
      
      // prepare for a new command - clear current input, generate
      // a new prompt and scroll to the bottom. set `makeReady` to
      // true to make the terminal ready at the same time.
      newCommand: function(makeReady) {
        if (makeReady) {
          this.ready();
        }
        
        var prompt = this._optionsForNewPrompt();
        this._prompt.innerText = prompt.text;
        
        if ('color' in prompt) {
          this._prompt.style.color = prompt.color;
        } else {
          this._prompt.style.color = '';
        }
        
        if ('className' in prompt) {
          this._prompt.className = 'prompt ' + prompt.className;
        } else {
          this._prompt.className = 'prompt';
        }
        
        this.clearCommand();
        this._scrollToBottom();
      },
      
      //
      // Private API
      
      _appendOutputText: function(text, className) {
        // TODO: text should be appended using a <pre> so we don't need to do
        // any of this replacement crap
        var ele = document.createElement('div');
        ele.className = 'text-line ' + (className || '');
        ele.innerHTML = text.replace(/\n/g, "<br/>")
                            .replace(/ /g,  "&nbsp;");
        this._appendOutputElement(ele);
      },
      
      _appendOutputElement: function(ele) {
        ele.className += ' output-item';
        this._output.appendChild(ele);
        this._scrollToBottom();
      },
      
      _getCommand: function() {
        return this._command.value;
      },
      
      _scrollToBottom: function() {
        this.root.scrollTop = this.root.scrollHeight;
      },
      
      _optionsForNewPrompt: function() {
        var prompt = (typeof this._userPrompt == 'function') ? this._userPrompt() : this._userPrompt;
        return prompt || DEFAULT_PROMPT;
      },
      
      _bell: function() {
        console.log("bell!");
      },
      
      _handlePaste: function(e) {
        var pastedText = undefined;
        if (e.clipboardData && e.clipboardData.getData) {
          pastedText = e.clipboardData.getData('text/plain');
        }
        if (pastedText !== undefined) {
          console.log(pastedText);
        }
      },
      
      _handleEnter: function() {
        if (this._echo) {
          this._echoCurrentCommand();
        }
        var command = this._getCommand();
        if (this._evaluator) {
          this.clearCommand();
          if (this._history.length == 0 || command != this._history[this._history.length - 1]) {
            this._history.push(command);
          }
          this._evaluator(command, this);
        } else {
          this.newCommand();
        }
      },
      
      _handleClear: function() {
        this.clearCommand();
      },
      
      _handleHistoryNav: function(dir) {
        
        if (this._history.length == 0) {
          return;
        }
        
        var cmd = null;
        
        if (dir == 'prev') {
          if (this._historyIx === null) {
            this._historyStash = this._command.value || '';
            this._historyIx = this._history.length - 1;
          } else {
            this._historyIx--;
            if (this._historyIx < 0) {
              this._historyIx = 0;
            }
          }
        } else {
          if (this._historyIx === null) {
            return;
          }
          this._historyIx++;
          if (this._historyIx == this._history.length) {
            cmd = this._historyStash;
            this._historyIx = null;
          }
        }
        
        if (cmd === null) {
          cmd = this._history[this._historyIx];
        }
        
        this._command.value = cmd;
        
      },
      
      _handleAutocomplete: function() {
        console.log("AUTO-COMPLETE");
      },
      
      _echoCurrentCommand: function() {
        var line = document.createElement('div');
        line.className = 'input-line';
        
        var prompt = document.createElement('span');
        prompt.className = this._prompt.className;
        prompt.style.color = this._prompt.style.color;
        prompt.textContent = this._prompt.textContent;
        
        var cmd = document.createElement('span');
        cmd.className = 'command';
        cmd.textContent = this._getCommand();
        
        line.appendChild(prompt);
        line.appendChild(cmd);
        
        this._appendOutputElement(line);
      },
      
      _buildStructure: function() {
        
        var self = this;
        
        var root        = document.createElement('div'),
            output      = document.createElement('output'),
            line        = document.createElement('div'),
            prompt      = document.createElement('span'),
            cmdWrapper  = document.createElement('span'),
            cmd         = document.createElement('input');
            
        root.className        = 'hk-console';
        line.className        = 'input-line';
        cmdWrapper.className  = 'command-wrapper';
        cmd.type              = 'text';
        cmd.className         = 'command';
        
        cmdWrapper.appendChild(cmd);
        line.appendChild(prompt);
        line.appendChild(cmdWrapper);
        root.appendChild(output);
        root.appendChild(line);
        
        root.onclick = function() { cmd.focus(); }
        cmd.onpaste = function(evt) { self._handlePaste(evt); evt.preventDefault(); };
        cmd.onkeydown = function(evt) {
          switch (evt.which) {
            case 8:  if (self._command.value.length == 0) self._bell();     break;
            case 13: evt.preventDefault(); self._handleEnter();             break;
            case 27: evt.preventDefault(); self._handleClear();             break;
            case 38: evt.preventDefault(); self._handleHistoryNav('prev');  break;
            case 40: evt.preventDefault(); self._handleHistoryNav('next');  break;
            case 9:  evt.preventDefault(); self._handleAutocomplete();      break;
          }
        };
        
        this.root     = root;
        this._output  = output;
        this._input   = line;
        this._prompt  = prompt;
        this._command = cmd;
        
      }
    }
  });
  
})();