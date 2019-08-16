(defconst +home-dir+ "~")
(defconst +emacs-dir+ (concat +home-dir+ "/emacs"))
(defconst +emacs-profiles-dir+ (concat +emacs-dir+ "/profiles"))
(defconst +emacs-lib-dir+ (concat +emacs-dir+ "/libs"))
(defconst +emacs-conf-dir+ (concat +emacs-dir+ "/config"))
(defconst +emacs-tmp-dir+ (concat +emacs-dir+ "/tmp"))
(defconst +emacs-snippets-dir+ (concat +emacs-dir+ "/snippets"))
(defconst +dev-dir+ (concat +home-dir+ "/dev"))

(defun add-load-path (p)
  (add-to-list 'load-path (concat +emacs-dir+ "/" p)))
(defun add-lib-path (p)
  (add-to-list 'load-path (concat +emacs-lib-dir+ "/" p)))
(defun load-conf-file (f)
  (load-file (concat +emacs-conf-dir+ "/" f ".el")))
(defun load-lib-file (f)
  (load-file (concat +emacs-lib-dir+ "/" f)))
(defun load-profile (p)
  (load-file (concat +emacs-profiles-dir+ "/" p ".el")))
(defun load-customizations ()
  (let ((filename (concat +emacs-dir+ "/custom.el")))
    (if (file-readable-p filename)
        (load-file filename))))
(load-conf-file "expand-region")
(load-conf-file "flycheck")
(load-conf-file "web")


;; ========= Python ==========
(package-initialize)
(elpy-enable)
(setenv "LC_CTYPE" "UTF-8")

(add-to-list 'package-archives
              '("melpa" . "http://melpa.milkbox.net/packages/") t)


;; ========= Set colours ==========

;; do not allow auto split

(setq split-height-threshold 1200)
(setq split-width-threshold 2000)

;; Set cursor and mouse-pointer colours

(set-foreground-color "white")

;; Set region background colour
(set-face-background 'region "blue")

;; Set emacs background colour
(set-background-color "black")

;; ===== Turn on Auto Fill mode automatically in all modes =====

;; Auto-fill-mode the the automatic wrapping of lines and insertion of
;; newlines when the cursor goes over the column limit.

;; This should actually turn on auto-fill-mode by default in all major
;; modes. The other way to do this is to turn on the fill for specific modes
;; via hooks.

(setq auto-fill-mode 1)

;; ========== Enable Line and Column Numbering ==========

;; Show line-number in the mode line
(line-number-mode 1)

;; Show column-number in the mode line
(column-number-mode 1)

;; ========== Support Wheel Mouse Scrolling ==========

(mouse-wheel-mode t)

;; ================ set up expand-region =======================
(add-to-list 'load-path "~/.emacs.d/plugins/expand-region/")
(require 'expand-region)
(global-set-key (kbd "C-c l") 'er/mark-word)
(global-set-key (kbd "C-=") 'er/expand-region)
(put 'erase-buffer 'disabled nil)


;; hot key for windmove
(global-set-key (kbd "C-c <left>")  'windmove-left)
(global-set-key (kbd "C-c <right>") 'windmove-right)
(global-set-key (kbd "C-c <up>")    'windmove-up)
(global-set-key (kbd "C-c <down>")  'windmove-down)

;; package for DirTree
(add-to-list 'load-path "~/.emacs.d/package/")
(add-to-list 'load-path "~/.emacs.d/tree/")
(require 'windata)
(require 'dirtree)
(require 'desktop)
(add-to-list 'desktop-globals-to-save 'windata-named-winconf)

(require 'yasnippet)
(yas-global-mode 1)

;; ============== web development package ==================
;(require 'ac-js2-mode)
(add-to-list 'load-path "~/.emacs.d/skewer-mode-master/")
(add-to-list 'load-path "~/.emacs.d/emacs-web-server/")
(add-to-list 'load-path "~/.emacs.d/npm/")
;(require 'npm)
(require 'js2-mode)
(require 'skewer-mode)
(require 'skewer-repl)
(require 'simple-httpd)
(require 'skewer-bower)
(require 'skewer-html)
(require 'skewer-css)
; (add-hook 'js-mode-hook 'js2-minor-mode)
(setq js2-hightlight-level 4)
(add-hook 'js-mode-hook 'js2-mode)
;; skewer mode

(defun my-skewer-mode-hook ()
  "Hooks for Web mode."
  (defun run-skewer-server()
    (interactive)
    (httpd-start)
    (browse-url (format "http://%s:%d"
                (cl-case httpd-host
                  ((nil) "0.0.0.0") ((local) "localhost") (otherwise httpd-host)) httpd-port)))
  (defun my-run-skewer(directory)
    (interactive "DServe directory: \n")
    (httpd-serve-directory directory)
    (run-skewer))
  )
(add-hook 'skewer-mode-hook 'my-skewer-mode-hook)
(add-hook 'js2-mode-hook 'skewer-mode)
(add-hook 'css-mode-hook 'skewer-css-mode)
(add-hook 'html-mode-hook 'skewer-html-mode)
;; -------- auto complete --------------
(require 'ac-js2)
; (add-hook 'js2-mode-hook 'ac-js2-setup-auto-complete-mode)
; (add-hook 'js2-mode-hook 'auto-complete-mode)
(setq ac-js2-evaluate-calls t)


;(skewer-bower-load "jQuery" "2.1.1")
; change browser to Chromium
;(setq browse-url-browser-function 'browse-url-generic
;          browse-url-generic-program "chromium-browser")

;; web-mode
(add-to-list 'load-path "~/.emacs.d/web-mode/")
(require 'web-mode)
(add-to-list 'auto-mode-alist '("\\.phtml\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.tpl\\.php\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.[agj]sp\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.as[cp]x\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.erb\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.mustache\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.djhtml\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.html?\\'" . web-mode))
; indentation setup and refresh browser
(defun my-web-mode-hook ()
  "Hooks for Web mode."
  (setq web-mode-markup-indent-offset 2)  ; html indent
  (setq web-mode-css-indent-offset 2)
  (setq web-mode-code-indent-offset 4)
  (setq web-mode-script-padding 4)
  (setq-default indent-tabs-mode nil)
  (add-hook 'skewer-html-mode-hook 'my-skewer-mode-hook)
  (add-hook 'web-mode-hook 'skewer-html-mode)
  (global-set-key (kbd "C-c a") 'er/mark-outer-tag)
  )
(add-hook 'web-mode-hook  'my-web-mode-hook)
(define-key skewer-html-mode-map (kbd "C-c C-c") 'browse-url-of-buffer)
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )


;; ==================== R code ========================
(add-to-list 'load-path "~/.emacs.d/ESS/lisp")
(add-to-list 'load-path "~/.emacs.d/ESS/")
;(require 'ess-autoloads)
(require 'ess-site)
;(setq exec-path (append exec-path '("~/.emacs.d/ess/")))

(defun set-exec-path-from-shell-PATH ()
  (let ((path-from-shell (replace-regexp-in-string
                          "[ \t\n]*$"
                          ""
                          (shell-command-to-string "$SHELL --login -i -c 'echo $PATH'"))))
    (setenv "PATH" path-from-shell)
    (setq exec-path (split-string path-from-shell path-separator))))

(when (and window-system (eq system-type 'darwin))
  ;; When started from Emacs.app or similar, ensure $PATH
  ;; is the same the user would see in Terminal.app
  (set-exec-path-from-shell-PATH))


(setq inferior-ess-r-help-command ".ess.help(\"%s\", help.type='html')\n")


;; ============================= miscellaneous =================================

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; (defun my-mark-current-word (&optional arg allow-extend)       ;;
;;     "Put point at beginning of current word, set mark at end." ;;
;;     (interactive "p\np")                                       ;;
;;     (setq arg (if arg arg 1))                                  ;;
;;     (if (and allow-extend                                      ;;
;;              (or (and (eq last-command this-command) (mark t)) ;;
;;                  (region-active-p)))                           ;;
;;         (set-mark                                              ;;
;;          (save-excursion                                       ;;
;;            (when (< (mark) (point))                            ;;
;;              (setq arg (- arg)))                               ;;
;;            (goto-char (mark))                                  ;;
;;            (forward-word arg)                                  ;;
;;            (point)))                                           ;;
;;       (let ((wbounds (bounds-of-thing-at-point 'word)))        ;;
;;         (unless (consp wbounds)                                ;;
;;           (error "No word at point"))                          ;;
;;         (if (>= arg 0)                                         ;;
;;             (goto-char (car wbounds))                          ;;
;;           (goto-char (cdr wbounds)))                           ;;
;;         (push-mark (save-excursion                             ;;
;;                      (forward-word arg)                        ;;
;;                      (point)))                                 ;;
;;         (activate-mark))))                                     ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(ess-R-font-lock-keywords
   (quote
    ((ess-R-fl-keyword:modifiers . t)
     (ess-R-fl-keyword:fun-defs . t)
     (ess-R-fl-keyword:keywords . t)
     (ess-R-fl-keyword:assign-ops . t)
     (ess-R-fl-keyword:constants . t)
     (ess-fl-keyword:fun-calls . t)
     (ess-fl-keyword:numbers)
     (ess-fl-keyword:operators)
     (ess-fl-keyword:delimiters)
     (ess-fl-keyword:=)
     (ess-R-fl-keyword:F&T)
     (ess-R-fl-keyword:%op%))))
 '(inhibit-startup-screen t)
 '(python-shell-interpreter "ipython"))
