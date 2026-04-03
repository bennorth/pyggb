Functions to evaluate arbitrary GeoGebra commands
=================================================

As an "escape hatch" to allow use of GeoGebra commands which are not
(yet) provided as Python, you can directly evaluate a string as a
GeoGebra command.  Sometimes this results in one GeoGebra object being
created; sometimes, in general more than one object can be returned.
There are therefore two variants of this functionality.


Evaluate a command known to return a single object
--------------------------------------------------

.. py:function:: EvalCommand(ggb_cmd)

   Evaluate the given *ggb_cmd* string as a GeoGebra command.  If the
   string is malformed, or well-formed but generates an error, or
   results in more than one GeoGebra object, an exception is raised.
   Otherwise, the resulting single GeoGebra object is wrapped and
   returned.

   If you would like to refer to an existing GeoGebra object in your
   construction, you can use its :py:attr:`_ggb_label` property.  For
   example,

   .. code-block:: python

      A = Point(1, 1)
      B = Point(7, 2)

      # Usually you would use the Python Line() function, but to
      # illustrate the use of existing objects:
      s = EvalCommand(f"Line({A._ggb_label}, {B._ggb_label})")


Evaluate a command in general returning multiple objects
--------------------------------------------------------

.. py:function:: EvalCommandMultiple(ggb_cmd)

   Evaluate the given *ggb_cmd* string as a GeoGebra command.  If the
   string is malformed, or well-formed but generates an error, an
   exception is raised.  Otherwise, the resulting GeoGebra object or
   objects are wrapped and returned *as a Python list*, even if there
   is only one object.

   If you would like to refer to an existing GeoGebra object in your
   construction, you can use its :py:attr:`_ggb_label` property.  For
   example,

   .. code-block:: python

      k1 = Circle(4, 2, 2)
      k2 = Circle(-3, 1, 3)

      # Usually you would use the Python Tangent() function, but to
      # illustrate the use of existing objects:
      ts = EvalCommandMultiple(f"Tangent({k1._ggb_label}, {k2._ggb_label})")
      print(len(ts))  # 4
