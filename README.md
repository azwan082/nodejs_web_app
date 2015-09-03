## NodeJS Web Application starter

What this package provide?

- Gruntfile
- MongoDB database
- Common pages
    - main page
    - login
    - logout
    - register
    - dashboard
    - user settings
- Bootstrap theme
- Session
- Auth system using PassportJS
- File uploads
- Image processing using ImageMagick
- Send email
- Form ajax validation

## To get started:

Install dependencies using Homebrew:

- NodeJS (`brew install node010`)
- MongoDB (`brew install mongodb24`)
- ImageMagick (`brew install imagemagick`)

Note: Homebrew is installed at ~/Applications/opt/, `brew` is symlinked to ~/Applications/bin/ and this directory was added to PATH through ~/.bash_profile

Setup project:

1. Install grunt-cli & bower globally (`npm install -g grunt-cli bower`)
2. Clone repo (`git clone https://github.com/azwan082/nodejs_web_app.git`)
3. Rename config.json.example to config.json and configure the values
4. Install npm dependencies (`npm install`)
5. Install bower dependencies (`bower install`)
6. Start server using grunt (`grunt`)