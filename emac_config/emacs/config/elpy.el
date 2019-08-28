(setq python-indent-offset 4)

(add-lib-path "elpa/elpy-20190725.2259")
(add-lib-path "elpa/company-20190430.1852")
(add-lib-path "elpa/find-file-in-project-20190720.313")
(add-lib-path "elpa/highlight-indentation-20181204.839")
(add-lib-path "elpa/ivy-20190809.1551")
(add-lib-path "elpa/python-0.26.1")
(add-lib-path "elpa/pyvenv-20181228.1722")
(add-lib-path "elpa/s-20180406.808")
(add-lib-path "elpa/yasnippet-20190724.1204")
(require 'elpy)
(elpy-enable)

(setq elpy-shell-use-project-root nil)  ;; C-c C-c will switch to file folder
(setq elpy-shell-display-buffer-after-send t)
(add-hook 'elpy-mode (lambda () (auto-complete-mode -1)))

;; http://manpages.ubuntu.com/manpages/eoan/man1/elpy.1.html
(setq python-shell-interpreter "ipython")
;; python-shell-interpreter-args "--pylab=qt5 --pdb --nosep --classic"

;; python-shell-prompt-regexp ">>> "
;; python-shell-prompt-output-regexp ""
;; python-shell-completion-setup-code "from IPython.core.completerlib import module_completion"
;; python-shell-completion-module-string-code "';'.join(module_completion('''%s'''))\n"
;; python-shell-completion-string-code "';'.join(get_ipython().Completer.all_completions('''%s'''))\n"


;; ------------- useful tool ---------
;; profiling
;; M-x elpy-profile-buffer-or-region
