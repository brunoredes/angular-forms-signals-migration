## Good Practice
- BDD and Gherking
- AAA Pattern
- One expect per test
- Boy Scout Rule
- makeSUT pattern

## Anti Patterns
- Cuckoo (aka Stranger). This is a test method that sits in the same unit test but doesn’t really belong there.

- Test-per-Method. Although a one-to-one relationship between test and production classes is a reasonable starting point, a one-to-one relationship between test and production method is almost always a bad idea.

- Anal Probe. A test that has to use unhealthy ways to perform its task, such as reading private fields using reflection.

- Conjoined Twins. Tests that are called unit tests but are really integration tests since there is no isolation between the system-under-test and the tests.

- Happy Path. The tests stay on happy paths (i.e. expected results, e.g. 18 years old) without testing for boundaries and exceptions (e.g. -2 years old).

- Slow Poke. A unit test that runs incredibly slow. When developers kick it off, they have time to go to the bathroom, grab a smoke, or worse, kick the test off before they go home at the end of the day.

- Giant. A unit test that, although it is validly testing the object under test, can span thousands of lines and contain many many test cases. This can be an indicator that the system-under-test is a God Object.

- Mockery. Sometimes mocking can be good, and handy. But sometimes developers can lose themselves in their effort to mock out what isn’t being tested. In this case, a unit test contains so many mocks, stubs, and/or fakes that the system under test isn’t even being tested at all, instead data returned from mocks is what is being tested.

- Inspector. A unit test that violates encapsulation in an effort to achieve 100% code coverage, but knows so much about what is going on in the object that any attempt to refactor will break the existing test and require any change to be reflected in the unit test.

- Generous Leftovers (aka Chain Gangexternal, Wet Floorexternal). An instance where one unit test creates data that is persisted somewhere, and another test reuses the data for its own devious purposes. If the “generator” is ran afterward, or not at all, the test using that data will outright fail.

- Local Hero (aka Hidden Dependency, Operating System Evangelist, Wait and Seeexternal, Environmental Vandalexternal). A test case that is dependent on something specific to the development environment it was written on, in order to run. The result is that the test passes on development boxes, but fails when someone attempts to run it elsewhere.

- Nitpicker. A unit test which compares a complete output when it’s really only interested in small parts of it, so the test has to continually be kept in line with otherwise unimportant details.

- Secret Catcher. A test that at first glance appears to be doing no testing due to the absence of assertions, but as they say, “the devil is in the details.” The test is really relying on an exception to be thrown when a mishap occurs, and is expecting the testing framework to capture the exception and report it to the user as a failure.

- Dodger. A unit test which has lots of tests for minor (and presumably easy to test) side effects, but never tests the core desired behavior. Sometimes you may find this in database access related tests, where a method is called, then the test selects from the database and runs assertions against the result.

- Loudmouth. A unit test (or test suite) that clutters up the console with diagnostic messages, logging, and other miscellaneous chatter, even when tests are passing.

- Greedy Catcher. A unit test which catches exceptions and swallows the stack trace, sometimes replacing it with a less informative failure message, but sometimes even just logging (cf. Loudmouth) and letting the test pass.

- Sequencer. A unit test that depends on items in an unordered list appearing in the same order during assertions.

- Enumerator (aka Test With No Nameexternal). Unit tests where each test case method name is only an enumeration, e.g. test, test, test. As a result, the intention of the test case is unclear, and the only way to be sure is to read the test case code and pray for clarity.

- Free Ride (aka Piggybackexternal). Rather than write a new test case method to test another feature or functionality, a new assertion rides along in an existing test case.

- Excessive Setup (aka Mother Henexternal). A test that requires a lot of work to set up in order to even begin testing. Sometimes several hundred lines of code are used to setup the environment for one test, with several objects involved, which can make it difficult to really ascertain what is being tested due to the “noise” of all of the setup.

- Line hitter. At first glance, the tests cover everything and code coverage tools confirm it with 100%, but in reality the tests merely hit the code, without doing any output analysis.

- Forty-Foot Pole Test (seeexternal). Afraid of getting too close to the class they are trying to test, these tests act at a distance, separated by countless layers of abstraction and thousands of lines of code from the logic they are checking.

- The Liar (aka Evergreen Testsexternal, Success Against All Odds). A test doesn’t validate any behaviour and passes in every scenario. Any new bug introduced in the code will never be discovered by this test. It was probably created after the implementation was finished, so the author of this test couldn’t know whether the test actually tests something.
