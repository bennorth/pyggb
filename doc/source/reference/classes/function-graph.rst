FunctionGraph
=============

.. py:class:: FunctionGraph

   Instances of :py:class:`FunctionGraph` represent the graphs of
   functions of the form *y=⋯*, where the right-hand side is an
   expression with a free variable *x*.  By default, the domain is as
   large as makes sense, but this can optionally be restricted to obey
   given lower and upper bounds.

   .. py:method:: FunctionGraph(expr_str)

      Construct the graph of the function given by the string
      *expr_str*, which is interpreted as a function of a free
      variable named *x*.  If the given expression string is not well
      formed, an error is thrown.

   .. py:method:: FunctionGraph(expr_str, lower_bound, upper_bound)
      :noindex:

      Construct the graph of the function given by the string
      *expr_str*, interpreted as above, with domain given by the
      interval between *lower_bound* and *upper_bound*.  The two
      bounds must be either Python numbers or wrapped GeoGebra
      :py:class:`Number` instances.

   .. py:method:: __call__(x)

      Apply the function to the value *x*, which can be a Python
      number, or a wrapped GeoGebra :py:class:`Number`.  Return a
      wrapped GeoGebra :py:class:`Number`.

   .. py:property:: latex
      :type: str

      |getOnlyProp| A string of LaTeX representing the expression in
      *x* for the function, giving, e.g., :math:`x +
      \operatorname{sin} \left( x \right)`.

      Depending on whether the function is recognised as "special",
      for example a parabola, the LaTeX may or may not include an
      initial ":math:`y=`".

   .. py:classmethod:: power(a, b)

      Construct and return a :py:class:`FunctionGraph` representing
      the function :math:`x\mapsto ax^b`.

   .. py:classmethod:: exponential(a, b)

      Construct and return a :py:class:`FunctionGraph` representing
      the function :math:`x\mapsto ab^x`.

   .. py:classmethod:: logarithm(a, b, c)

      Construct and return a :py:class:`FunctionGraph` representing
      the function :math:`x\mapsto a\log_b(cx)`.

   A :py:class:`FunctionGraph` has the following common properties:

   * :py:attr:`is_independent`
   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`line_style`
   * :py:attr:`line_thickness`
   * :py:attr:`label_visible`
   * :py:attr:`label_style`
   * :py:attr:`caption`
