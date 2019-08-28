(package-initialize)
(setq split-height-threshold 1200)
(setq split-width-threshold 2000)

(defconst +home-dir+ "~")
(defconst +emacs-dir+ (concat +home-dir+ "/emacs"))
(defconst +emacs-profiles-dir+ (concat +emacs-dir+ "/profiles"))
(defconst +emacs-lib-dir+ (concat +emacs-dir+ "/libs"))
(defconst +emacs-conf-dir+ (concat +emacs-dir+ "/config"))
(defconst +emacs-tmp-dir+ (concat +emacs-dir+ "/tmp"))
(defconst +emacs-snippets-dir+ (concat +emacs-dir+ "/snippets"))

;; new projects will be created under this directory
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

(add-load-path "")
(add-load-path "lib")

(load-profile "default")
(load-profile "js")
(load-profile "php")
(load-profile "python")

;; download MiKTex and GhostScript first
;; Miktex download @ https://miktex.org/download
;; GhostScript donwload @ https://www.ghostscript.com/download/gsdnld.html

(load-profile "tex")

(setq split-height-threshold 1200)
(setq split-width-threshold 2000)

;; pip install pyreadline

;;(load-profile "golang")
;;(load-profile "clojure")

;; (load-customizations)

;; ;;(add-to-list 'command-switch-alist '("clojure" . (lambda (n) (load-profile "clojure"))))
;; ;;(add-to-list 'command-switch-alist '("ruby" . (lambda (n) (load-profile "ruby"))))
;; ;;(add-to-list 'command-switch-alist '("android" . (lambda (n) (load-profile "android"))))
;; (custom-set-variables
;;  ;; custom-set-variables was added by Custom.
;;  ;; If you edit it by hand, you could mess it up, so be careful.
;;  ;; Your init file should contain only one such instance.
;;  ;; If there is more than one, they won't work right.
;;  '(custom-safe-themes
;;    (quote
;;     ("8aebf25556399b58091e533e455dd50a6a9cba958cc4ebb0aab175863c25b9a4" "a8245b7cc985a0610d71f9852e9f2767ad1b852c2bdea6f4aadc12cce9c4d6d0" default)))
;;  '(js2-strict-inconsistent-return-warning nil))
;; (custom-set-faces
;;  ;; custom-set-faces was added by Custom.
;;  ;; If you edit it by hand, you could mess it up, so be careful.
;;  ;; Your init file should contain only one such instance.
;;  ;; If there is more than one, they won't work right.
;;  )
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(frame-background-mode (quote dark))
 '(js2-strict-inconsistent-return-warning nil)
 '(js2-strict-missing-semi-warning nil)
<<<<<<< HEAD
 '(package-selected-packages (quote (auctex)))
 '(send-mail-function (quote smtpmail-send-it)))
=======
 '(package-selected-packages (quote (elpy python)))
 '(python-shell-interpreter "ipython"))
>>>>>>> 049f0d1f7b51170934b74d5c14f38b5a77987e93
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
<<<<<<< HEAD
(put 'set-goal-column 'disabled nil)

(global-set-key (kbd "C-c C-k") 'comint-kill-region)
=======
>>>>>>> 049f0d1f7b51170934b74d5c14f38b5a77987e93
