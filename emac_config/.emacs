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

(setq split-height-threshold 1200)
(setq split-width-threshold 2000)

(setq preview-gs-command "C:/Program Files (x86)/gs/gs9.23/bin/gswin32c.exe")

;;(load-profile "golang")
;;(load-profile "clojure")
;;pip install pyreadline

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
 '(comint-prompt-read-only nil)
 '(frame-background-mode (quote dark))
 '(js2-strict-inconsistent-return-warning nil)
 '(js2-strict-missing-semi-warning nil)
 '(package-selected-packages (quote (auctex)))
 '(send-mail-function (quote smtpmail-send-it)))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
(put 'set-goal-column 'disabled nil)

(global-set-key (kbd "C-c C-k") 'comint-kill-region)
