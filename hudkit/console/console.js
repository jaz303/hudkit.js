;(function(global, hk) {
  
  var DEFAULT_PROMPT = {text: '>'},
      HISTORY_LENGTH = 500;
  
  var superKlass = hk.Widget.prototype;
  
  hk.Console = hk.Widget.extend({
    methods: {
      
      print: function(text) { this._appendOutputText(text); },
      printError: function(text) { this._appendOutputText(text, 'error'); },
      printSuccess: function(text) { this._appendOutputText(text, 'success'); },
      
      printHTML: function(html) {
        var ele = document.createElement('div');
        ele.innerHTML = html;
        this._appendOutputElement(ele);
      },
      
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
      
      // clear the user's current command
      clearCommand: function() { this._command.value = ''; },
      
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
      
      init: function() {
        
        superKlass.init.apply(this, arguments);
        
        this._queue = [];
        this._history = [];
        
        this.echoOn();
        this.notReady();
      
      },
      
      _appendOutputText: function(text, className) {
        var ele = document.createElement('div');
        ele.className = 'text-line ' + (className || '');
        ele.innerHTML = text.replace("\n", "<br/>");
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
          this._evaluator(command, this);
        } else {
          this.newCommand();
        }
      },
      
      _handleHistoryNav: function(dir) {
        console.log("HISTORY - " + dir);
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
  
})(this, hk);