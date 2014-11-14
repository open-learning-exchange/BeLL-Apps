

```
mkdir make;
cd make;
git clone https://github.com/open-learning-exchange/BeLL-Apps.git;
git clone https://github.com/open-learning-exchange/Bell-Installer-for-Windows.git;
cd BeLL-Apps;
git tag [tag name];
git push --tags;
rm -rf .git;
npm install couchapp;
cd ..
mv BeLL-Apps Bell-Installer-for-Windows/;
rm -rf Bell-Installer-for-Windows/.git;
tar czvf Bell-Installer-for-Windows--[tag name].tgz Bell-Installer-for-Windows;
```

Upload the doc to as a public file to the OLE Google Docs and then post the link to the [Hackpad](https://bell.hackpad.com/Welcome-Get-started-here.-kUDXrl7RA6K#:h=Release-Downloads).
