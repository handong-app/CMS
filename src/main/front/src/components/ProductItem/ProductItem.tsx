import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ProductItemProps } from "../../types/product.types";

function ProductItem({
  title,
  description,
  price,
  thumbnail,
}: ProductItemProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" height="180" image={thumbnail} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" color="primary">
            {price.toLocaleString()}원
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductItem;
