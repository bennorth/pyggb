Writing and running a PyGgb program
===================================

Write and edit your Python program in the editor pane (left).  To run
your program, use the :guilabel:`Run` button in the command bar.  The
GeoGebra objects (e.g., points or lines) which your program creates
will appear in the GeoGebra construction pane (top right).  Anything
your program sends to standard output (e.g., via :code:`print()`)
will appear in the console output pane (bottom right).  If your
program encounters an error, the error pane will appear (bottom left)
with details.


.. _pausing-resuming-and-stopping:

Pausing, resuming, and stopping your program
--------------------------------------------

Normally, your program runs all the way to the end, and the GeoGeobra
construction is only shown when your program has completely finished.
For short programs this is fine, but for more complicated
constructions, this can cause difficulties:

* You might prefer to see the construction being built up as your
  program runs.

* For a very long-running program, your browser might say that the
  page is unresponsive, meaning you have to reload the app.

You can pause your program, but only when it's executing a
:code:`time.sleep()`.  The sleep time can be zero.  For example,
when running this code:

.. code-block:: python

   import time
   for y in range(60):
       for x in range(100):
           Point(x / 10, y / 10)
           time.sleep(0)

you will see the grid of Points build up, and you can pause or stop
the program.

While a program is paused, the :guilabel:`Run` button resumes it, and
the :guilabel:`Stop` button stops the program altogether, abandoning
its execution.
