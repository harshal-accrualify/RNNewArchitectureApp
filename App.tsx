/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import NativeSampleModule from './tm/NativeSampleModule';
import FBSeries from './example/fbSeries';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Cxx TurboModule">
            NativeSampleModule.reverseString(...) = {NativeSampleModule.reverseString("the quick brown fox jumps over the lazy dog")}
          </Section>
          <Section title="Cxx TurboModule">
              NativeSampleModule.passLargeNumber(...) = {NativeSampleModule.passLargeNumber("9223372036854775807")}
          </Section>
          <Section title="Cxx TurboModule">
              NativeSampleModule.passCustomType(...) = {JSON.stringify(NativeSampleModule.passCustomType({key:"123", enabled:true, time:undefined}))}
          </Section>
        </View>
        <FBSeries/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;



// import React, {useState} from 'react';
// import {
//   SafeAreaView,
//   Text,
//   StyleSheet,
//   View,
//   ScrollView,
//   Button,
// } from 'react-native';
// import NativeSampleModule from './tm/NativeSampleModule';

// const TESTS = [20, 22, 25, 28, 30, 36, 38];

// const doJsFib = (n: number): number => {
//   if (n < 2) {
//     return n;
//   }
//   return doJsFib(n - 1) + doJsFib(n - 2);
// };

// const doFibTest = async (n: number) => {
//   // Wait 100ms before starting the test to allow the app to settle and render new results
//   await new Promise(res => setTimeout(() => res(null), 100));

//   let before = Date.now();
//   // C++
//   NativeSampleModule.doFibExpensive(n);
//   const duration = Date.now() - before;

//   before = Date.now();
//   // JS
//   doJsFib(n);
//   const duration2 = Date.now() - before;

//   return [duration, duration2] as const;
// };

// interface FibonacciTestResult {
//   n: number;
//   cppDuration: number;
//   jsDuration: number;
// }

// export default function App(): JSX.Element {
//   const [running, setRunning] = useState(false);
//   // Store the results of the tests
//   const [results, setResults] = useState<FibonacciTestResult[]>([]);

//   const onPressStart = async () => {
//     if (running) {
//       return;
//     }

//     setRunning(true);

//     for await (const n of TESTS) {
//       const [cppDuration, jsDuration] = await doFibTest(n);
//       setResults(prev => [...prev, {n, cppDuration, jsDuration}]);
//     }

//     setRunning(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.scrollStyle}>
//         <Text style={styles.title}>C++ vs JS Fibonacci Test</Text>
//         <Button
//           disabled={running}
//           title={running ? 'Running - please wait...' : 'Start test'}
//           onPress={onPressStart}
//         />

//         <View style={styles.titleRow}>
//           <Text style={styles.boldText}>n</Text>
//           <Text style={styles.boldText}>C++</Text>
//           <Text style={styles.boldText}>JS</Text>
//         </View>

//         <View style={styles.resultsContainer}>
//           {results.map((test, i) => (
//             <View style={styles.resultRow} key={`test-${i}`}>
//               <Text style={styles.text}>{test.n}</Text>
//               <Text style={styles.text}>{test.cppDuration}ms</Text>
//               <Text style={styles.text}>{test.jsDuration}ms</Text>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   scrollStyle: {
//     flex: 1,
//   },
//   button: {
//     backgroundColor: 'lightblue',
//     padding: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   resultsContainer: {
//     marginTop: 20,
//     gap: 8,
//   },
//   titleRow: {
//     marginTop: 20,
//     width: '100%',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   resultRow: {
//     width: '100%',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   text: {
//     flex: 1,
//     textAlign: 'center',
//   },
//   boldText: {
//     flex: 1,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginVertical: 12,
//     textAlign: 'center',
//   },
// });