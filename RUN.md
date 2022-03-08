# Playground run
- Nightly build: 20220307-2008

## Setup:
* Mac M1 Pro, 32 GB RAM
* Monterey 12.2.1
* rbenv with ruby 2.7.0 (If you have trouble installing it, try with `RUBY_CFLAGS=“-w” rbenv install 2.7.0`)

## Steps (From most recent to least recent command)

### [[TurboModules] Create CalendarModule spec]()
Commands:
1. Remove the old `NativeCalendarModule.js`
1. Create a new file named `NativeCalendarModule.js`
2. Copy the following snippet:
    ```js
    'use strict';

    import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
    import {TurboModuleRegistry} from 'react-native';

    export interface Spec extends TurboModule {
        +getConstants: () => {|
            "DEFAULT_EVENT_NAME": "New Event"
        |};

        getString(id: string): Promise<string>;
    }

    export default (TurboModuleRegistry.get<Spec>('CalendarModule'): ?Spec);
    ```


#### CI:
1. Remove Native Calendar Module: `rm NativeCalendarModule.js`
1. Add Specs
    """sh
    echo "'use strict';

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
    +getConstants: () => {|
        \"DEFAULT_EVENT_NAME\": \"New Event\"
    |};

    getString(id: string): Promise<string>;
}

export default (TurboModuleRegistry.get<Spec>('CalendarModule'): ?Spec);" > NativeCalendarModule.js
    """

### SNAPSHOT
This commit can be used to create a project template `react-native-objc-migration`. This can be used as starting point for a CI pipeline to test the migration from `NativeModule` and `NativeComponents` to `TurboModules` and `Fabric`.

### [[Native Components] Expose a native property]()
1. Open the `RNTMapManager.m` file
2. Add the following line:
    ```obj-c
    RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
    ```
3. Open the `App.js` file
4. Use the property on the component:
    ```js
    <MapView zoomEnabled={false} style={{ width: "100%", height: "100%" }} />
    ```
5. Run `npx react-native run-ios`
6. Try to pinch and zoom the map. Observe that you can't zoom.



### [[Native Components] Connect the MapManager in JS]()
1. Create a new file `MapView.js`
1. Paste the following snippet:
    ```js
    // MapView.js

    import { requireNativeComponent } from 'react-native';

    // requireNativeComponent automatically resolves 'RNTMap' to 'RNTMapManager'
    module.exports = requireNativeComponent('RNTMap');
    ```
1. Open the `App.js`
1. Add the following import: `import MapView from './MapView.js';`
1. Add the following component in the `return` statement: `<MapView style={{ width: "100%", height: "100%" }} />`
1. run `npx react-native run-ios`

### [[Native Components] Create RNTMapManager (native side)]()
1. Create a new Objective-C file, called it `RNTMapManager.m`
2. Copy the following snippet:
    ```obj-c
    // RNTMapManager.m
    #import <MapKit/MapKit.h>

    #import <React/RCTViewManager.h>

    @interface RNTMapManager : RCTViewManager
    @end

    @implementation RNTMapManager

    RCT_EXPORT_MODULE(RNTMap)

    - (UIView *)view
    {
    return [[MKMapView alloc] init];
    }

    @end
    ```
3. Run `cmd+B` to build it
4. Run `cmd+R` to run it

### [Exporting Constants]()
1. Open the 'RCTCalendarModule.m'
1. Add the following snippets:
    ```objective-c
    - (NSDictionary *)constantsToExport
    {
        return @{ @"DEFAULT_EVENT_NAME": @"New Event" };
    }

    + (BOOL)requiresMainQueueSetup
    {
        return NO;
    }
    ```
1. Open the `App.js` file
1. Add the definition: `const { DEFAULT_EVENT_NAME } = CalendarModule.getConstants();`
1. Replace the `"testName"` with the `DEFAULT_EVENT_NAME`.
1. Run `npx react-native run-ios`
1. Click on the button
1. Observe the message `Pretending to create an event New Event at testLocation` in the Chrome console. _Note:_ The name of the event has changed from `testName` to `New Event`.

### [Better Native Module Export]()
1. Create a new `NativeCalendarModule.js` file
1. Paset the following snippet:
    ```js
    /**
    * This exposes the native CalendarModule module as a JS module. This has a
    * function 'createCalendarEvent' which takes the following parameters:

    * 1. String name: A string representing the name of the event
    * 2. String location: A string representing the location of the event
    */
    import { NativeModules } from 'react-native';
    const { CalendarModule } = NativeModules;
    export default CalendarModule;
    ```
1. Open the `App.js` file
1. Remove `NativeModules,` from the list of imports
1. Remove the `const { CalendarModule } = NativeModules;` line
1. Add the import `import CalendarModule  from "./NativeCalendarModule"`. _Note:_ In this case, we don't need to use the curly brackets.
1. Save (`cmd+S`) to trigger a reload
1. Press the button and observe the message `Pretending to create an event testName at testLocation` appearing in the Chrome console.

### [Access the Native Module in JS]()
Commands:
1. Open `App.js` file
1. Delete the file content
1. Paste the following snippet:
    ```js
    import React from 'react';
    import type {Node} from 'react';
    import {
    SafeAreaView,
    StatusBar,
    Button,
    useColorScheme,
    NativeModules,
    } from "react-native";

    const { CalendarModule } = NativeModules;

    const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? 'black' : 'white',
    };

    const onPress = () => {
        CalendarModule.createCalendarEvent('testName', 'testLocation');
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <Button
                title="Click to invoke your native module!"
                color="#841584"
                onPress={onPress}/>
            </SafeAreaView>
        );
    };

    export default App;
    ```
1. Run `cd .. && npx react-native run-ios`
1. Observe the app launching
1. Select the Simulator and press `cmd+D`
1. Select `Debug on Chrome`
1. Press `cmd+opt+I` to open the developer tools
1. Select the simulator and refresh the App (`cmd+R` twice. The first time it will start recording the Simulator. Stop the recording and delete it).
1. Tap on the button and observe the `Pretending to create an event testName at testLocation` message in the Chrome console.

### [Export native method to JS (Native Side)]()
Commands:
1. Open `RCTCalendarModule.m`
1. Add the import:
    ```obj-c
    #import <React/RCTLog.h>
    ```
1. Add the code:
    ```obj-c
    RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
    {
        RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
    }
    ```
1. `cmd+B` to build it
1. `cmd+R` to run it

### [create RCTCalendar Native Module (Native side)]()
Commands:
1. `cd ios && open AwesomeApp.xcworkspace`
1. Select the `AwesomeApp` folder
1. `cmd+N` to create a new file
1. Choose `New Header File`
1. Call it `RCTCalendarModule`
1. Paste the code:
   ```obj-c
   #import <React/RCTBridgeModule.h>
   @interface RCTCalendarModule : NSObject <RCTBridgeModule>
   @end
   ```
1. `cmd+N` to create a new file
1. Choose `New Objective-C File`
1. Call it `RCTCalendarModule`
1. Set membership to both `AwesomeApp` and `AwesomeAppTests`
1. Paste the code
    ```obj-c
    #import "RCTCalendarModule.h"

    @implementation RCTCalendarModule

    // To export a module named RCTCalendarModule
    RCT_EXPORT_MODULE();

    @end
    ```
1. `cmd+B` to build it
1. `cmd+R` to run it

### [react-native init](4c38d7e)
Commands:
1. `npx react-native init AwesomeApp --version 0.0.0-20220307-2008-ae3d4f700` When asked to install cocoapods, choose `1 (yes with gem)`.
1. `cd AwesomeApp`
1. `npx react-native start`
1. `npx react-native run-ios`